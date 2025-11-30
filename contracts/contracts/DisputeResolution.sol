// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title DisputeResolution
 * @dev Handles disputes between borrowers and lenders
 */
contract DisputeResolution is AccessControl, Pausable {
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum DisputeStatus {
        Open,
        UnderReview,
        Resolved,
        Closed
    }

    enum DisputeOutcome {
        Pending,
        FavorBorrower,
        FavorLender,
        Compromise,
        Dismissed
    }

    struct Dispute {
        uint256 disputeId;
        uint256 loanId;
        address borrower;
        address lender;
        address arbitrator;
        string reason;
        string borrowerEvidence;
        string lenderEvidence;
        DisputeStatus status;
        DisputeOutcome outcome;
        uint256 createdAt;
        uint256 resolvedAt;
        string resolution;
        uint256 compensationAmount;
    }

    struct Vote {
        address arbitrator;
        DisputeOutcome vote;
        string comment;
        uint256 timestamp;
    }

    uint256 private disputeCounter;

    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => Vote[]) public disputeVotes;
    mapping(uint256 => uint256[]) public loanDisputes;
    mapping(address => uint256[]) public userDisputes;

    event DisputeCreated(
        uint256 indexed disputeId,
        uint256 indexed loanId,
        address indexed initiator,
        string reason,
        uint256 timestamp
    );

    event DisputeUnderReview(
        uint256 indexed disputeId,
        address indexed arbitrator,
        uint256 timestamp
    );

    event EvidenceSubmitted(
        uint256 indexed disputeId,
        address indexed submitter,
        string evidence,
        uint256 timestamp
    );

    event VoteCast(
        uint256 indexed disputeId,
        address indexed arbitrator,
        DisputeOutcome vote,
        uint256 timestamp
    );

    event DisputeResolved(
        uint256 indexed disputeId,
        DisputeOutcome outcome,
        uint256 compensationAmount,
        uint256 timestamp
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ARBITRATOR_ROLE, msg.sender);
    }

    /**
     * @dev Create a new dispute
     */
    function createDispute(
        uint256 _loanId,
        address _borrower,
        address _lender,
        string memory _reason
    ) external whenNotPaused returns (uint256) {
        require(
            msg.sender == _borrower || msg.sender == _lender,
            "Only loan parties can create dispute"
        );

        disputeCounter++;
        uint256 disputeId = disputeCounter;

        disputes[disputeId] = Dispute({
            disputeId: disputeId,
            loanId: _loanId,
            borrower: _borrower,
            lender: _lender,
            arbitrator: address(0),
            reason: _reason,
            borrowerEvidence: "",
            lenderEvidence: "",
            status: DisputeStatus.Open,
            outcome: DisputeOutcome.Pending,
            createdAt: block.timestamp,
            resolvedAt: 0,
            resolution: "",
            compensationAmount: 0
        });

        loanDisputes[_loanId].push(disputeId);
        userDisputes[_borrower].push(disputeId);
        userDisputes[_lender].push(disputeId);

        emit DisputeCreated(disputeId, _loanId, msg.sender, _reason, block.timestamp);

        return disputeId;
    }

    /**
     * @dev Assign arbitrator to dispute
     */
    function assignArbitrator(uint256 _disputeId, address _arbitrator)
        external
        onlyRole(ADMIN_ROLE)
        whenNotPaused
    {
        require(hasRole(ARBITRATOR_ROLE, _arbitrator), "Not an arbitrator");
        
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.status == DisputeStatus.Open, "Dispute not open");

        dispute.arbitrator = _arbitrator;
        dispute.status = DisputeStatus.UnderReview;

        emit DisputeUnderReview(_disputeId, _arbitrator, block.timestamp);
    }

    /**
     * @dev Submit evidence for dispute
     */
    function submitEvidence(uint256 _disputeId, string memory _evidence)
        external
        whenNotPaused
    {
        Dispute storage dispute = disputes[_disputeId];
        require(
            dispute.status == DisputeStatus.Open ||
                dispute.status == DisputeStatus.UnderReview,
            "Dispute not accepting evidence"
        );
        require(
            msg.sender == dispute.borrower || msg.sender == dispute.lender,
            "Not a party to dispute"
        );

        if (msg.sender == dispute.borrower) {
            dispute.borrowerEvidence = _evidence;
        } else {
            dispute.lenderEvidence = _evidence;
        }

        emit EvidenceSubmitted(_disputeId, msg.sender, _evidence, block.timestamp);
    }

    /**
     * @dev Cast vote on dispute (for multi-arbitrator system)
     */
    function castVote(
        uint256 _disputeId,
        DisputeOutcome _vote,
        string memory _comment
    ) external onlyRole(ARBITRATOR_ROLE) whenNotPaused {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.status == DisputeStatus.UnderReview, "Dispute not under review");

        Vote memory vote = Vote({
            arbitrator: msg.sender,
            vote: _vote,
            comment: _comment,
            timestamp: block.timestamp
        });

        disputeVotes[_disputeId].push(vote);

        emit VoteCast(_disputeId, msg.sender, _vote, block.timestamp);
    }

    /**
     * @dev Resolve dispute
     */
    function resolveDispute(
        uint256 _disputeId,
        DisputeOutcome _outcome,
        string memory _resolution,
        uint256 _compensationAmount
    ) external onlyRole(ARBITRATOR_ROLE) whenNotPaused {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.status == DisputeStatus.UnderReview, "Dispute not under review");
        require(
            msg.sender == dispute.arbitrator || hasRole(ADMIN_ROLE, msg.sender),
            "Not assigned arbitrator"
        );

        dispute.status = DisputeStatus.Resolved;
        dispute.outcome = _outcome;
        dispute.resolution = _resolution;
        dispute.compensationAmount = _compensationAmount;
        dispute.resolvedAt = block.timestamp;

        emit DisputeResolved(
            _disputeId,
            _outcome,
            _compensationAmount,
            block.timestamp
        );
    }

    /**
     * @dev Close dispute
     */
    function closeDispute(uint256 _disputeId)
        external
        onlyRole(ADMIN_ROLE)
        whenNotPaused
    {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.status == DisputeStatus.Resolved, "Dispute not resolved");

        dispute.status = DisputeStatus.Closed;
    }

    /**
     * @dev Get dispute details
     */
    function getDispute(uint256 _disputeId)
        external
        view
        returns (Dispute memory)
    {
        return disputes[_disputeId];
    }

    /**
     * @dev Get votes for a dispute
     */
    function getDisputeVotes(uint256 _disputeId)
        external
        view
        returns (Vote[] memory)
    {
        return disputeVotes[_disputeId];
    }

    /**
     * @dev Get disputes for a loan
     */
    function getLoanDisputes(uint256 _loanId)
        external
        view
        returns (uint256[] memory)
    {
        return loanDisputes[_loanId];
    }

    /**
     * @dev Get disputes for a user
     */
    function getUserDisputes(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userDisputes[_user];
    }

    /**
     * @dev Get total number of disputes
     */
    function getTotalDisputes() external view returns (uint256) {
        return disputeCounter;
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}

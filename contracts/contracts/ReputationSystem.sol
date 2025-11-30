// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ReputationSystem
 * @dev Manages trust scores and reputation for borrowers and lenders
 */
contract ReputationSystem is AccessControl, Pausable {
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Reputation {
        uint256 trustScore; // 0-1000 (1000 = perfect)
        uint256 totalLoans;
        uint256 successfulLoans;
        uint256 defaultedLoans;
        uint256 totalBorrowed;
        uint256 totalRepaid;
        uint256 onTimePayments;
        uint256 latePayments;
        uint256 lastUpdated;
        bool isFraudulent;
    }

    struct Activity {
        uint256 timestamp;
        string activityType; // "loan_created", "repayment", "default", etc.
        uint256 amount;
        bool positive;
    }

    mapping(address => Reputation) public reputations;
    mapping(address => Activity[]) public activityHistory;
    mapping(address => bool) public verifiedUsers;

    event ReputationUpdated(
        address indexed user,
        uint256 newTrustScore,
        uint256 timestamp
    );

    event ActivityRecorded(
        address indexed user,
        string activityType,
        uint256 amount,
        bool positive,
        uint256 timestamp
    );

    event UserVerified(address indexed user, uint256 timestamp);

    event FraudDetected(address indexed user, uint256 timestamp);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
    }

    /**
     * @dev Initialize reputation for a new user
     */
    function initializeReputation(address _user) external onlyRole(UPDATER_ROLE) {
        require(reputations[_user].lastUpdated == 0, "User already initialized");

        reputations[_user] = Reputation({
            trustScore: 500, // Start with neutral score
            totalLoans: 0,
            successfulLoans: 0,
            defaultedLoans: 0,
            totalBorrowed: 0,
            totalRepaid: 0,
            onTimePayments: 0,
            latePayments: 0,
            lastUpdated: block.timestamp,
            isFraudulent: false
        });

        emit ReputationUpdated(_user, 500, block.timestamp);
    }

    /**
     * @dev Record loan creation
     */
    function recordLoanCreated(address _borrower, uint256 _amount)
        external
        onlyRole(UPDATER_ROLE)
        whenNotPaused
    {
        Reputation storage rep = reputations[_borrower];
        rep.totalLoans++;
        rep.totalBorrowed += _amount;
        rep.lastUpdated = block.timestamp;

        _recordActivity(_borrower, "loan_created", _amount, true);
        _updateTrustScore(_borrower);
    }

    /**
     * @dev Record successful repayment
     */
    function recordRepayment(
        address _borrower,
        uint256 _amount,
        bool _onTime
    ) external onlyRole(UPDATER_ROLE) whenNotPaused {
        Reputation storage rep = reputations[_borrower];
        rep.totalRepaid += _amount;

        if (_onTime) {
            rep.onTimePayments++;
        } else {
            rep.latePayments++;
        }

        rep.lastUpdated = block.timestamp;

        _recordActivity(_borrower, "repayment", _amount, true);
        _updateTrustScore(_borrower);
    }

    /**
     * @dev Record successful loan completion
     */
    function recordLoanCompleted(address _borrower)
        external
        onlyRole(UPDATER_ROLE)
        whenNotPaused
    {
        Reputation storage rep = reputations[_borrower];
        rep.successfulLoans++;
        rep.lastUpdated = block.timestamp;

        _recordActivity(_borrower, "loan_completed", 0, true);
        _updateTrustScore(_borrower);
    }

    /**
     * @dev Record loan default
     */
    function recordDefault(address _borrower, uint256 _amount)
        external
        onlyRole(UPDATER_ROLE)
        whenNotPaused
    {
        Reputation storage rep = reputations[_borrower];
        rep.defaultedLoans++;
        rep.lastUpdated = block.timestamp;

        _recordActivity(_borrower, "default", _amount, false);
        _updateTrustScore(_borrower);

        // Check for fraud patterns
        if (rep.defaultedLoans >= 3 || rep.defaultedLoans * 100 / rep.totalLoans > 50) {
            _markAsFraudulent(_borrower);
        }
    }

    /**
     * @dev Mark user as verified (KYC completed)
     */
    function verifyUser(address _user)
        external
        onlyRole(ADMIN_ROLE)
        whenNotPaused
    {
        verifiedUsers[_user] = true;
        
        // Boost trust score for verified users
        Reputation storage rep = reputations[_user];
        if (rep.trustScore < 600) {
            rep.trustScore = 600;
            rep.lastUpdated = block.timestamp;
        }

        emit UserVerified(_user, block.timestamp);
        emit ReputationUpdated(_user, rep.trustScore, block.timestamp);
    }

    /**
     * @dev Mark user as fraudulent
     */
    function markAsFraudulent(address _user)
        external
        onlyRole(ADMIN_ROLE)
        whenNotPaused
    {
        _markAsFraudulent(_user);
    }

    /**
     * @dev Internal function to mark user as fraudulent
     */
    function _markAsFraudulent(address _user) internal {
        Reputation storage rep = reputations[_user];
        rep.isFraudulent = true;
        rep.trustScore = 0;
        rep.lastUpdated = block.timestamp;

        emit FraudDetected(_user, block.timestamp);
        emit ReputationUpdated(_user, 0, block.timestamp);
    }

    /**
     * @dev Record activity
     */
    function _recordActivity(
        address _user,
        string memory _activityType,
        uint256 _amount,
        bool _positive
    ) internal {
        Activity memory activity = Activity({
            timestamp: block.timestamp,
            activityType: _activityType,
            amount: _amount,
            positive: _positive
        });

        activityHistory[_user].push(activity);

        emit ActivityRecorded(
            _user,
            _activityType,
            _amount,
            _positive,
            block.timestamp
        );
    }

    /**
     * @dev Update trust score based on reputation data
     */
    function _updateTrustScore(address _user) internal {
        Reputation storage rep = reputations[_user];

        if (rep.isFraudulent) {
            rep.trustScore = 0;
            return;
        }

        uint256 score = 500; // Base score

        // Factor 1: Loan completion rate (0-300 points)
        if (rep.totalLoans > 0) {
            uint256 completionRate = (rep.successfulLoans * 100) / rep.totalLoans;
            score += (completionRate * 3);
        }

        // Factor 2: On-time payment rate (0-200 points)
        uint256 totalPayments = rep.onTimePayments + rep.latePayments;
        if (totalPayments > 0) {
            uint256 onTimeRate = (rep.onTimePayments * 100) / totalPayments;
            score += (onTimeRate * 2);
        }

        // Factor 3: Repayment ratio (0-200 points)
        if (rep.totalBorrowed > 0) {
            uint256 repaymentRatio = (rep.totalRepaid * 100) / rep.totalBorrowed;
            if (repaymentRatio > 100) repaymentRatio = 100;
            score += (repaymentRatio * 2);
        }

        // Factor 4: Verification bonus (50 points)
        if (verifiedUsers[_user]) {
            score += 50;
        }

        // Factor 5: Penalty for defaults
        score = score > (rep.defaultedLoans * 100) ? score - (rep.defaultedLoans * 100) : 0;

        // Cap at 1000
        if (score > 1000) score = 1000;

        rep.trustScore = score;

        emit ReputationUpdated(_user, score, block.timestamp);
    }

    /**
     * @dev Get reputation details
     */
    function getReputation(address _user)
        external
        view
        returns (Reputation memory)
    {
        return reputations[_user];
    }

    /**
     * @dev Get trust score
     */
    function getTrustScore(address _user) external view returns (uint256) {
        return reputations[_user].trustScore;
    }

    /**
     * @dev Get activity history
     */
    function getActivityHistory(address _user)
        external
        view
        returns (Activity[] memory)
    {
        return activityHistory[_user];
    }

    /**
     * @dev Check if user is eligible for loan
     */
    function isEligibleForLoan(address _user, uint256 _amount)
        external
        view
        returns (bool)
    {
        Reputation memory rep = reputations[_user];

        // Fraud check
        if (rep.isFraudulent) return false;

        // Must be verified
        if (!verifiedUsers[_user]) return false;

        // Minimum trust score
        if (rep.trustScore < 400) return false;

        // No active defaults
        if (rep.defaultedLoans > 0 && rep.successfulLoans == 0) return false;

        // Amount limit based on trust score
        uint256 maxAmount = (rep.trustScore * 1 ether) / 100; // Example: 1000 score = 10 ETH
        if (_amount > maxAmount) return false;

        return true;
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

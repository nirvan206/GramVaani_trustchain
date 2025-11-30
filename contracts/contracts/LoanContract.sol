// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title LoanContract
 * @dev Manages loan creation, approval, repayment, and tracking
 */
contract LoanContract is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum LoanStatus {
        Pending,
        Approved,
        Active,
        Repaid,
        Defaulted,
        Rejected
    }

    struct Loan {
        uint256 loanId;
        address borrower;
        address lender;
        uint256 amount;
        uint256 interestRate; // in basis points (e.g., 1000 = 10%)
        uint256 duration; // in days
        uint256 createdAt;
        uint256 approvedAt;
        uint256 repaidAmount;
        LoanStatus status;
        string purpose;
        string collateral;
    }

    struct Repayment {
        uint256 repaymentId;
        uint256 loanId;
        uint256 amount;
        uint256 timestamp;
        address payer;
    }

    uint256 private loanCounter;
    uint256 private repaymentCounter;

    mapping(uint256 => Loan) public loans;
    mapping(uint256 => Repayment[]) public loanRepayments;
    mapping(address => uint256[]) public borrowerLoans;
    mapping(address => uint256[]) public lenderLoans;

    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 duration
    );

    event LoanApproved(
        uint256 indexed loanId,
        address indexed lender,
        uint256 timestamp
    );

    event LoanRejected(uint256 indexed loanId, uint256 timestamp);

    event RepaymentMade(
        uint256 indexed loanId,
        uint256 indexed repaymentId,
        uint256 amount,
        uint256 remainingAmount,
        uint256 timestamp
    );

    event LoanFullyRepaid(uint256 indexed loanId, uint256 timestamp);

    event LoanDefaulted(uint256 indexed loanId, uint256 timestamp);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(APPROVER_ROLE, msg.sender);
    }

    /**
     * @dev Create a new loan request
     */
    function createLoan(
        uint256 _amount,
        uint256 _interestRate,
        uint256 _duration,
        string memory _purpose,
        string memory _collateral
    ) external whenNotPaused returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(_interestRate <= 10000, "Interest rate too high"); // Max 100%

        loanCounter++;
        uint256 loanId = loanCounter;

        loans[loanId] = Loan({
            loanId: loanId,
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            interestRate: _interestRate,
            duration: _duration,
            createdAt: block.timestamp,
            approvedAt: 0,
            repaidAmount: 0,
            status: LoanStatus.Pending,
            purpose: _purpose,
            collateral: _collateral
        });

        borrowerLoans[msg.sender].push(loanId);

        emit LoanCreated(loanId, msg.sender, _amount, _interestRate, _duration);

        return loanId;
    }

    /**
     * @dev Approve a loan request
     */
    function approveLoan(uint256 _loanId)
        external
        payable
        onlyRole(APPROVER_ROLE)
        whenNotPaused
        nonReentrant
    {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Pending, "Loan not pending");
        require(msg.value >= loan.amount, "Insufficient funds");

        loan.status = LoanStatus.Approved;
        loan.lender = msg.sender;
        loan.approvedAt = block.timestamp;

        lenderLoans[msg.sender].push(_loanId);

        // Transfer funds to borrower
        payable(loan.borrower).transfer(loan.amount);

        // Refund excess
        if (msg.value > loan.amount) {
            payable(msg.sender).transfer(msg.value - loan.amount);
        }

        emit LoanApproved(_loanId, msg.sender, block.timestamp);
    }

    /**
     * @dev Reject a loan request
     */
    function rejectLoan(uint256 _loanId)
        external
        onlyRole(APPROVER_ROLE)
        whenNotPaused
    {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Pending, "Loan not pending");

        loan.status = LoanStatus.Rejected;

        emit LoanRejected(_loanId, block.timestamp);
    }

    /**
     * @dev Make a repayment on a loan
     */
    function makeRepayment(uint256 _loanId)
        external
        payable
        whenNotPaused
        nonReentrant
    {
        Loan storage loan = loans[_loanId];
        require(
            loan.status == LoanStatus.Approved || loan.status == LoanStatus.Active,
            "Loan not active"
        );
        require(msg.value > 0, "Repayment amount must be greater than 0");

        if (loan.status == LoanStatus.Approved) {
            loan.status = LoanStatus.Active;
        }

        loan.repaidAmount += msg.value;

        repaymentCounter++;
        Repayment memory repayment = Repayment({
            repaymentId: repaymentCounter,
            loanId: _loanId,
            amount: msg.value,
            timestamp: block.timestamp,
            payer: msg.sender
        });

        loanRepayments[_loanId].push(repayment);

        // Transfer to lender
        payable(loan.lender).transfer(msg.value);

        uint256 totalDue = calculateTotalDue(_loanId);
        uint256 remainingAmount = totalDue > loan.repaidAmount
            ? totalDue - loan.repaidAmount
            : 0;

        emit RepaymentMade(
            _loanId,
            repaymentCounter,
            msg.value,
            remainingAmount,
            block.timestamp
        );

        // Check if fully repaid
        if (loan.repaidAmount >= totalDue) {
            loan.status = LoanStatus.Repaid;
            emit LoanFullyRepaid(_loanId, block.timestamp);
        }
    }

    /**
     * @dev Mark a loan as defaulted
     */
    function markAsDefaulted(uint256 _loanId)
        external
        onlyRole(ADMIN_ROLE)
        whenNotPaused
    {
        Loan storage loan = loans[_loanId];
        require(
            loan.status == LoanStatus.Active || loan.status == LoanStatus.Approved,
            "Loan not active"
        );

        uint256 dueDate = loan.approvedAt + (loan.duration * 1 days);
        require(block.timestamp > dueDate, "Loan not yet overdue");

        loan.status = LoanStatus.Defaulted;

        emit LoanDefaulted(_loanId, block.timestamp);
    }

    /**
     * @dev Calculate total amount due (principal + interest)
     */
    function calculateTotalDue(uint256 _loanId) public view returns (uint256) {
        Loan memory loan = loans[_loanId];
        uint256 interest = (loan.amount * loan.interestRate) / 10000;
        return loan.amount + interest;
    }

    /**
     * @dev Get loan details
     */
    function getLoan(uint256 _loanId) external view returns (Loan memory) {
        return loans[_loanId];
    }

    /**
     * @dev Get all loans for a borrower
     */
    function getBorrowerLoans(address _borrower)
        external
        view
        returns (uint256[] memory)
    {
        return borrowerLoans[_borrower];
    }

    /**
     * @dev Get all loans for a lender
     */
    function getLenderLoans(address _lender)
        external
        view
        returns (uint256[] memory)
    {
        return lenderLoans[_lender];
    }

    /**
     * @dev Get repayment history for a loan
     */
    function getLoanRepayments(uint256 _loanId)
        external
        view
        returns (Repayment[] memory)
    {
        return loanRepayments[_loanId];
    }

    /**
     * @dev Get remaining amount to be repaid
     */
    function getRemainingAmount(uint256 _loanId)
        external
        view
        returns (uint256)
    {
        Loan memory loan = loans[_loanId];
        uint256 totalDue = calculateTotalDue(_loanId);
        return totalDue > loan.repaidAmount ? totalDue - loan.repaidAmount : 0;
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

    /**
     * @dev Get total number of loans
     */
    function getTotalLoans() external view returns (uint256) {
        return loanCounter;
    }
}

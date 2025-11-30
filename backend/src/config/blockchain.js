const { ethers } = require('ethers');
const logger = require('../utils/logger');

// Import contract ABIs (these will be generated after compilation)
const LoanContractABI = require('../../../contracts/artifacts/contracts/LoanContract.sol/LoanContract.json').abi;
const ReputationSystemABI = require('../../../contracts/artifacts/contracts/ReputationSystem.sol/ReputationSystem.json').abi;
const DisputeResolutionABI = require('../../../contracts/artifacts/contracts/DisputeResolution.sol/DisputeResolution.json').abi;

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.loanContract = null;
    this.reputationContract = null;
    this.disputeContract = null;
  }

  async initialize() {
    try {
      // Connect to blockchain
      this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
      
      // Create wallet from private key
      this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

      // Initialize contracts
      this.loanContract = new ethers.Contract(
        process.env.LOAN_CONTRACT_ADDRESS,
        LoanContractABI,
        this.signer
      );

      this.reputationContract = new ethers.Contract(
        process.env.REPUTATION_CONTRACT_ADDRESS,
        ReputationSystemABI,
        this.signer
      );

      this.disputeContract = new ethers.Contract(
        process.env.DISPUTE_CONTRACT_ADDRESS,
        DisputeResolutionABI,
        this.signer
      );

      logger.info('✅ Blockchain service initialized');
      logger.info(`Connected to network: ${(await this.provider.getNetwork()).name}`);
      logger.info(`Signer address: ${await this.signer.getAddress()}`);
    } catch (error) {
      logger.error('❌ Blockchain initialization error:', error);
      throw error;
    }
  }

  // Loan Contract Methods
  async createLoan(amount, interestRate, duration, purpose, collateral) {
    try {
      const tx = await this.loanContract.createLoan(
        ethers.parseEther(amount.toString()),
        interestRate,
        duration,
        purpose,
        collateral
      );
      const receipt = await tx.wait();
      
      // Extract loan ID from event
      const event = receipt.logs.find(log => {
        try {
          return this.loanContract.interface.parseLog(log).name === 'LoanCreated';
        } catch {
          return false;
        }
      });
      
      const parsedEvent = this.loanContract.interface.parseLog(event);
      return parsedEvent.args.loanId.toString();
    } catch (error) {
      logger.error('Error creating loan on blockchain:', error);
      throw error;
    }
  }

  async approveLoan(loanId, amount) {
    try {
      const tx = await this.loanContract.approveLoan(loanId, {
        value: ethers.parseEther(amount.toString())
      });
      await tx.wait();
      return true;
    } catch (error) {
      logger.error('Error approving loan on blockchain:', error);
      throw error;
    }
  }

  async makeRepayment(loanId, amount) {
    try {
      const tx = await this.loanContract.makeRepayment(loanId, {
        value: ethers.parseEther(amount.toString())
      });
      await tx.wait();
      return true;
    } catch (error) {
      logger.error('Error making repayment on blockchain:', error);
      throw error;
    }
  }

  async getLoan(loanId) {
    try {
      const loan = await this.loanContract.getLoan(loanId);
      return {
        loanId: loan.loanId.toString(),
        borrower: loan.borrower,
        lender: loan.lender,
        amount: ethers.formatEther(loan.amount),
        interestRate: loan.interestRate.toString(),
        duration: loan.duration.toString(),
        createdAt: loan.createdAt.toString(),
        approvedAt: loan.approvedAt.toString(),
        repaidAmount: ethers.formatEther(loan.repaidAmount),
        status: loan.status,
        purpose: loan.purpose,
        collateral: loan.collateral
      };
    } catch (error) {
      logger.error('Error getting loan from blockchain:', error);
      throw error;
    }
  }

  // Reputation Contract Methods
  async initializeReputation(userAddress) {
    try {
      const tx = await this.reputationContract.initializeReputation(userAddress);
      await tx.wait();
      return true;
    } catch (error) {
      logger.error('Error initializing reputation:', error);
      throw error;
    }
  }

  async getReputation(userAddress) {
    try {
      const rep = await this.reputationContract.getReputation(userAddress);
      return {
        trustScore: rep.trustScore.toString(),
        totalLoans: rep.totalLoans.toString(),
        successfulLoans: rep.successfulLoans.toString(),
        defaultedLoans: rep.defaultedLoans.toString(),
        totalBorrowed: ethers.formatEther(rep.totalBorrowed),
        totalRepaid: ethers.formatEther(rep.totalRepaid),
        onTimePayments: rep.onTimePayments.toString(),
        latePayments: rep.latePayments.toString(),
        lastUpdated: rep.lastUpdated.toString(),
        isFraudulent: rep.isFraudulent
      };
    } catch (error) {
      logger.error('Error getting reputation:', error);
      throw error;
    }
  }

  async verifyUser(userAddress) {
    try {
      const tx = await this.reputationContract.verifyUser(userAddress);
      await tx.wait();
      return true;
    } catch (error) {
      logger.error('Error verifying user:', error);
      throw error;
    }
  }

  // Dispute Contract Methods
  async createDispute(loanId, borrower, lender, reason) {
    try {
      const tx = await this.disputeContract.createDispute(loanId, borrower, lender, reason);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          return this.disputeContract.interface.parseLog(log).name === 'DisputeCreated';
        } catch {
          return false;
        }
      });
      
      const parsedEvent = this.disputeContract.interface.parseLog(event);
      return parsedEvent.args.disputeId.toString();
    } catch (error) {
      logger.error('Error creating dispute:', error);
      throw error;
    }
  }

  async getDispute(disputeId) {
    try {
      const dispute = await this.disputeContract.getDispute(disputeId);
      return {
        disputeId: dispute.disputeId.toString(),
        loanId: dispute.loanId.toString(),
        borrower: dispute.borrower,
        lender: dispute.lender,
        arbitrator: dispute.arbitrator,
        reason: dispute.reason,
        status: dispute.status,
        outcome: dispute.outcome,
        createdAt: dispute.createdAt.toString(),
        resolvedAt: dispute.resolvedAt.toString(),
        resolution: dispute.resolution,
        compensationAmount: ethers.formatEther(dispute.compensationAmount)
      };
    } catch (error) {
      logger.error('Error getting dispute:', error);
      throw error;
    }
  }

  // Listen to events
  setupEventListeners(io) {
    // Loan events
    this.loanContract.on('LoanCreated', (loanId, borrower, amount, interestRate, duration) => {
      logger.info(`Loan created: ${loanId}`);
      io.to(`user-${borrower}`).emit('loan-created', {
        loanId: loanId.toString(),
        amount: ethers.formatEther(amount)
      });
    });

    this.loanContract.on('LoanApproved', (loanId, lender, timestamp) => {
      logger.info(`Loan approved: ${loanId}`);
      io.emit('loan-approved', { loanId: loanId.toString() });
    });

    this.loanContract.on('RepaymentMade', (loanId, repaymentId, amount, remainingAmount, timestamp) => {
      logger.info(`Repayment made for loan: ${loanId}`);
      io.emit('repayment-made', {
        loanId: loanId.toString(),
        amount: ethers.formatEther(amount),
        remainingAmount: ethers.formatEther(remainingAmount)
      });
    });

    // Reputation events
    this.reputationContract.on('ReputationUpdated', (user, newTrustScore, timestamp) => {
      logger.info(`Reputation updated for ${user}: ${newTrustScore}`);
      io.to(`user-${user}`).emit('reputation-updated', {
        trustScore: newTrustScore.toString()
      });
    });

    logger.info('✅ Event listeners set up');
  }
}

const blockchainService = new BlockchainService();

module.exports = blockchainService;

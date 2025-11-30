import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Demo mode store with dummy data
const useDemoStore = create(
  persist(
    (set, get) => ({
      demoMode: true,
      
      // Demo user
      demoUser: {
        id: 'demo123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        name: 'Demo User',
        email: 'demo@trustchain.io',
        phone: '+91 9876543210',
        role: 'borrower',
        kycStatus: 'verified',
        language: 'en',
        location: {
          state: 'Maharashtra',
          district: 'Pune',
          village: 'Kharadi',
          pincode: '411014'
        },
        isActive: true,
        createdAt: '2024-01-10T10:30:00.000Z',
        lastLogin: new Date().toISOString()
      },

      // Demo loans (interestRate is stored as percentage, e.g., 5 = 5%)
      demoLoans: [
        {
          _id: 'loan1',
          blockchainLoanId: '1',
          borrower: {
            _id: 'demo123',
            name: 'Demo User',
            walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
          },
          lender: {
            _id: 'lender1',
            name: 'Jane Smith',
            walletAddress: '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
          },
          amount: 50000,
          interestRate: 12,
          duration: 90,
          purpose: 'Small Business',
          collateral: 'Shop equipment worth ₹75,000',
          status: 'active',
          repaidAmount: 15000,
          createdAt: '2024-12-15T15:00:00.000Z',
          approvedAt: '2024-12-16T10:00:00.000Z',
          dueDate: '2025-03-16T10:00:00.000Z'
        },
        {
          _id: 'loan2',
          blockchainLoanId: '2',
          borrower: {
            _id: 'demo123',
            name: 'Demo User',
            walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
          },
          lender: {
            _id: 'lender2',
            name: 'Rajesh Kumar',
            walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
          },
          amount: 25000,
          interestRate: 10,
          duration: 60,
          purpose: 'Agriculture',
          collateral: 'Land documents',
          status: 'repaid',
          repaidAmount: 27500,
          createdAt: '2024-10-01T09:00:00.000Z',
          approvedAt: '2024-10-02T11:00:00.000Z',
          dueDate: '2024-12-01T11:00:00.000Z'
        },
        {
          _id: 'loan3',
          blockchainLoanId: '3',
          borrower: {
            _id: 'demo123',
            name: 'Demo User',
            walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
          },
          amount: 30000,
          interestRate: 11,
          duration: 45,
          purpose: 'Education',
          collateral: '',
          status: 'pending',
          repaidAmount: 0,
          createdAt: '2025-01-05T14:00:00.000Z'
        }
      ],

      // Demo reputation
      demoReputation: {
        trustScore: '750',
        totalLoans: '5',
        successfulLoans: '4',
        defaultedLoans: '0',
        totalBorrowed: '200000.0',
        totalRepaid: '180000.0',
        onTimePayments: '12',
        latePayments: '2',
        lastUpdated: Date.now().toString(),
        isFraudulent: false
      },

      // Demo savings
      demoSavings: {
        balance: 18500,
        transactions: [
          {
            id: 'txn1',
            type: 'credit',
            amount: 5000,
            description: 'Initial Deposit',
            date: '2024-11-01T10:00:00.000Z',
            balanceAfter: 5000
          },
          {
            id: 'txn2',
            type: 'credit',
            amount: 8000,
            description: 'Crop Sale - Wheat',
            date: '2024-11-15T14:30:00.000Z',
            balanceAfter: 13000
          },
          {
            id: 'txn3',
            type: 'debit',
            amount: 2000,
            description: 'Fertilizer Purchase',
            date: '2024-11-20T09:15:00.000Z',
            balanceAfter: 11000
          },
          {
            id: 'txn4',
            type: 'credit',
            amount: 12000,
            description: 'Crop Sale - Rice',
            date: '2024-12-05T16:45:00.000Z',
            balanceAfter: 23000
          },
          {
            id: 'txn5',
            type: 'debit',
            amount: 3500,
            description: 'Equipment Maintenance',
            date: '2024-12-10T11:20:00.000Z',
            balanceAfter: 19500
          },
          {
            id: 'txn6',
            type: 'debit',
            amount: 1000,
            description: 'Seeds Purchase',
            date: '2024-12-28T08:00:00.000Z',
            balanceAfter: 18500
          },
          {
            id: 'txn7',
            type: 'credit',
            amount: 6500,
            description: 'Vegetable Sale',
            date: '2025-01-08T13:30:00.000Z',
            balanceAfter: 25000
          },
          {
            id: 'txn8',
            type: 'debit',
            amount: 6500,
            description: 'Loan Repayment',
            date: '2025-01-10T10:00:00.000Z',
            balanceAfter: 18500
          }
        ]
      },

      // Actions
      addDemoLoan: (loan) => set((state) => ({
        demoLoans: [...state.demoLoans, { ...loan, _id: `loan${Date.now()}` }]
      })),

      updateDemoLoan: (loanId, updates) => set((state) => ({
        demoLoans: state.demoLoans.map(loan => 
          loan._id === loanId ? { ...loan, ...updates } : loan
        )
      })),

      updateDemoUser: (updates) => set((state) => ({
        demoUser: { ...state.demoUser, ...updates }
      })),
    }),
    {
      name: 'trustchain-demo',
    }
  )
);

export default useDemoStore;

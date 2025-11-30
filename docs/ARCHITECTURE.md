# TrustChain System Architecture

## Overview

TrustChain is a decentralized microfinance platform built on blockchain technology, designed specifically for rural India. The system uses a multi-layer architecture combining public blockchain transparency with permissioned privacy layers.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   React UI   │  │  Multi-lang  │  │   Offline    │         │
│  │   Dashboard  │  │   Support    │  │   Support    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Express    │  │     JWT      │  │  Rate Limit  │         │
│  │   REST API   │  │     Auth     │  │   & CORS     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│   Business       │ │   Blockchain │ │   External   │
│   Logic Layer    │ │   Service    │ │   Services   │
│                  │ │              │ │              │
│ • Loan Mgmt     │ │ • Web3.js    │ │ • Payment    │
│ • Reputation    │ │ • Ethers.js  │ │ • KYC/AML    │
│ • Disputes      │ │ • Contract   │ │ • SMS/USSD   │
│ • Analytics     │ │   Interaction│ │ • Email      │
└──────────────────┘ └──────────────┘ └──────────────┘
        │                    │
        ▼                    ▼
┌──────────────────┐ ┌──────────────────────────────┐
│   Database       │ │   Blockchain Layer           │
│                  │ │                              │
│ • MongoDB        │ │ ┌──────────────────────────┐ │
│ • Redis Cache    │ │ │  Smart Contracts         │ │
│ • User Data      │ │ │  • LoanContract.sol      │ │
│ • Off-chain      │ │ │  • ReputationSystem.sol  │ │
│   Metadata       │ │ │  • DisputeResolution.sol │ │
└──────────────────┘ │ └──────────────────────────┘ │
                     │                              │
                     │ ┌──────────────────────────┐ │
                     │ │  Blockchain Networks     │ │
                     │ │  • Ethereum (Public)     │ │
                     │ │  • Polygon (Sidechain)   │ │
                     │ │  • Hyperledger (Private) │ │
                     │ └──────────────────────────┘ │
                     └──────────────────────────────┘
```

## Component Details

### 1. Frontend Layer

**Technology Stack:**
- React 18 with Vite
- TailwindCSS for styling
- React Router for navigation
- Zustand for state management
- React Query for data fetching
- i18next for internationalization
- Ethers.js for Web3 integration

**Key Features:**
- Responsive design for mobile and desktop
- Multi-language support (7+ Indian languages)
- Offline-first architecture with service workers
- Real-time updates via Socket.io
- MetaMask integration for wallet connection

**Pages:**
- Home/Landing page
- Authentication (Login/Register)
- Dashboard (Overview)
- Loan Application
- Loan Management
- Reputation Score
- User Profile
- Admin Panel (for regulators)

### 2. Backend API Layer

**Technology Stack:**
- Node.js with Express.js
- MongoDB for database
- Redis for caching
- JWT for authentication
- Socket.io for real-time communication
- Winston for logging

**API Endpoints:**

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with wallet
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

#### Loans
- `POST /api/loans` - Create loan request
- `GET /api/loans` - Get user's loans
- `GET /api/loans/:id` - Get loan details
- `PUT /api/loans/:id/approve` - Approve loan (lender)
- `POST /api/loans/:id/repay` - Make repayment

#### Reputation
- `GET /api/reputation/:address` - Get reputation score
- `GET /api/reputation/me/score` - Get current user's score

#### Disputes
- `POST /api/disputes` - Create dispute
- `GET /api/disputes/:id` - Get dispute details
- `PUT /api/disputes/:id/resolve` - Resolve dispute (arbitrator)

#### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment

#### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats (admin)

### 3. Blockchain Layer

**Smart Contracts:**

#### LoanContract.sol
```solidity
// Core functionality:
- createLoan() - Create new loan request
- approveLoan() - Approve and fund loan
- makeRepayment() - Process repayment
- markAsDefaulted() - Mark loan as defaulted
- calculateTotalDue() - Calculate total amount due
```

**Features:**
- Role-based access control (RBAC)
- Reentrancy protection
- Pausable in emergencies
- Event emission for tracking

#### ReputationSystem.sol
```solidity
// Core functionality:
- initializeReputation() - Create reputation profile
- recordLoanCreated() - Track loan creation
- recordRepayment() - Track repayments
- recordDefault() - Track defaults
- verifyUser() - Mark user as KYC verified
- markAsFraudulent() - Flag fraudulent users
```

**Trust Score Calculation:**
- Base score: 500/1000
- Loan completion rate: +0-300 points
- On-time payment rate: +0-200 points
- Repayment ratio: +0-200 points
- KYC verification: +50 points
- Penalties for defaults: -100 per default

#### DisputeResolution.sol
```solidity
// Core functionality:
- createDispute() - Initiate dispute
- submitEvidence() - Submit supporting evidence
- assignArbitrator() - Assign arbitrator to case
- castVote() - Arbitrator voting (multi-arbitrator)
- resolveDispute() - Final resolution
```

**Dispute Outcomes:**
- FavorBorrower
- FavorLender
- Compromise
- Dismissed

### 4. Database Layer

**MongoDB Collections:**

#### Users
```javascript
{
  _id: ObjectId,
  walletAddress: String (unique, indexed),
  name: String,
  email: String,
  phone: String,
  role: String (borrower/lender/admin/arbitrator),
  kycStatus: String (pending/verified/rejected),
  language: String,
  location: {
    state: String,
    district: String,
    village: String,
    pincode: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Loans
```javascript
{
  _id: ObjectId,
  blockchainLoanId: String (unique, indexed),
  borrower: ObjectId (ref: User),
  lender: ObjectId (ref: User),
  amount: Number,
  interestRate: Number,
  duration: Number,
  purpose: String,
  collateral: String,
  status: String (pending/approved/active/repaid/defaulted),
  repaidAmount: Number,
  approvedAt: Date,
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Redis Cache:**
- Session data
- Reputation scores (TTL: 5 minutes)
- Loan statistics (TTL: 1 hour)
- Rate limiting counters

## Data Flow

### Loan Application Flow

```
1. User fills loan form (Frontend)
   ↓
2. Form validation (Frontend)
   ↓
3. POST /api/loans (API Gateway)
   ↓
4. JWT authentication (Middleware)
   ↓
5. Check eligibility (Business Logic)
   ↓
6. Create loan on blockchain (Blockchain Service)
   ↓
7. Save metadata to MongoDB (Database)
   ↓
8. Emit socket event (Real-time)
   ↓
9. Return loan details (Response)
   ↓
10. Update UI (Frontend)
```

### Repayment Flow

```
1. User enters repayment amount (Frontend)
   ↓
2. Initiate Web3 transaction (Frontend)
   ↓
3. MetaMask confirmation (User)
   ↓
4. Transaction to blockchain (Blockchain)
   ↓
5. Smart contract processes payment (LoanContract)
   ↓
6. Update reputation (ReputationSystem)
   ↓
7. Emit RepaymentMade event (Blockchain)
   ↓
8. Backend listens to event (Event Listener)
   ↓
9. Update MongoDB (Database)
   ↓
10. Notify parties via socket (Real-time)
   ↓
11. Update UI (Frontend)
```

## Security Architecture

### Authentication & Authorization

**JWT-based Authentication:**
- Access tokens (7 days expiry)
- Refresh tokens (30 days expiry)
- Wallet signature verification

**Role-Based Access Control:**
- Borrower: Apply for loans, make repayments
- Lender: Approve loans, view borrower details
- Admin: Manage users, view analytics
- Arbitrator: Resolve disputes

### Smart Contract Security

**OpenZeppelin Standards:**
- AccessControl for role management
- ReentrancyGuard for preventing reentrancy attacks
- Pausable for emergency stops

**Security Measures:**
- Input validation
- Integer overflow protection (Solidity 0.8+)
- Rate limiting on sensitive operations
- Multi-signature for admin functions

### Data Security

**Encryption:**
- HTTPS/TLS for all communications
- Encrypted storage for sensitive data
- Hashed passwords (bcrypt)

**Privacy:**
- Personal data stored off-chain
- Only transaction hashes on blockchain
- GDPR-compliant data handling

## Scalability

### Horizontal Scaling

**Backend:**
- Stateless API servers
- Load balancer (Nginx/AWS ALB)
- Multiple instances with PM2

**Database:**
- MongoDB replica sets
- Redis cluster
- Read replicas for analytics

### Blockchain Scaling

**Layer 2 Solutions:**
- Polygon for low-cost transactions
- Optimistic rollups for batch processing
- State channels for frequent updates

**Optimization:**
- Batch transactions
- Off-chain computation with on-chain verification
- IPFS for large data storage

## Monitoring & Observability

**Logging:**
- Winston for structured logging
- Log levels: error, warn, info, debug
- Centralized log aggregation (ELK stack)

**Metrics:**
- Prometheus for metrics collection
- Grafana for visualization
- Custom dashboards for business metrics

**Alerting:**
- Sentry for error tracking
- PagerDuty for critical alerts
- Email/SMS notifications

**Health Checks:**
- `/health` endpoint
- Database connectivity
- Blockchain RPC status
- External service availability

## Disaster Recovery

**Backup Strategy:**
- Daily MongoDB backups
- Smart contract code versioning
- Transaction history on blockchain (immutable)

**Recovery Plan:**
- Database restore from backups
- Smart contract redeployment
- Data migration scripts

## Compliance & Regulatory

**RBI Guidelines:**
- KYC/AML verification
- Interest rate caps
- Loan amount limits
- Transparent fee structure

**Data Protection:**
- GDPR-compliant (for international users)
- Data retention policies
- Right to be forgotten (off-chain data)

**Audit Trail:**
- All transactions on blockchain
- Immutable history
- Transparent dispute resolution

## Future Enhancements

### Phase 2
- Mobile app (React Native)
- Voice interface for illiterate users
- Biometric authentication (Aadhaar)
- Advanced ML fraud detection

### Phase 3
- Multi-chain support (Solana, Cardano)
- Decentralized identity (DID)
- Insurance integration
- Micro-savings features

### Phase 4
- Cross-border remittances
- Supply chain financing
- Agricultural commodity trading
- Cooperative banking features

---

## Technology Choices Rationale

### Why Ethereum/Polygon?
- Mature ecosystem
- Strong developer community
- EVM compatibility
- Low transaction costs (Polygon)

### Why MongoDB?
- Flexible schema for evolving requirements
- Good performance for read-heavy workloads
- Easy horizontal scaling
- Rich query capabilities

### Why React?
- Component-based architecture
- Large ecosystem
- Excellent performance
- Strong community support

### Why Node.js?
- JavaScript full-stack
- Non-blocking I/O for real-time features
- Large package ecosystem
- Good for microservices

---

**Last Updated:** 2025-10-10
**Version:** 1.0.0

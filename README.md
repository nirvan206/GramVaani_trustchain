# TrustChain - Blockchain Microfinance Platform

A decentralized microfinance platform for rural India with multi-layer blockchain architecture, smart contracts, offline support, and multi-language accessibility.

## Features

- 🔗 **Multi-layer Blockchain**: Public (Ethereum), Permissioned (Hyperledger), Sidechain (Polygon)
- 📝 **Smart Contracts**: Automated loan approval, repayment tracking, dispute resolution
- 🏆 **Reputation System**: Decentralized trust scoring with fraud detection
- 📱 **Offline Support**: USSD, voice interface, SMS for low-connectivity areas
- 🌐 **Multi-language**: Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati
- 🔐 **Biometric Auth**: Aadhaar integration, face recognition, fingerprint
- 📊 **Analytics Dashboard**: Real-time monitoring for regulators and NGOs
- 💳 **Payment Integration**: UPI, Razorpay, Paytm support
- ✅ **Compliance**: RBI guidelines, KYC/AML, audit trails

## Project Structure

```
TrustChain/
├── contracts/          # Smart contracts (Solidity)
├── backend/           # Node.js API server
├── frontend/          # React web application
├── scripts/           # Deployment scripts
├── docs/              # Documentation
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd TrustChain

# Install all dependencies
npm run install-all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start local blockchain
npm run blockchain

# Deploy smart contracts
npm run deploy-contracts

# Start backend server
npm run backend

# Start frontend (in new terminal)
npm run frontend
```

### Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Blockchain RPC: http://localhost:8545

## Development

### Smart Contracts

```bash
cd contracts
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network localhost
```

### Backend

```bash
cd backend
npm run dev  # Start with nodemon
npm test     # Run tests
```

### Frontend

```bash
cd frontend
npm run dev  # Start Vite dev server
npm run build  # Production build
```

## Deployment

### Smart Contracts

```bash
# Deploy to testnet (Polygon Mumbai)
npx hardhat run scripts/deploy.js --network mumbai

# Deploy to mainnet (Polygon)
npx hardhat run scripts/deploy.js --network polygon
```

### Backend

```bash
# Using PM2
pm2 start backend/src/server.js --name trustchain-api

# Using Docker
docker build -t trustchain-backend ./backend
docker run -p 5000:5000 trustchain-backend
```

### Frontend

```bash
# Build for production
cd frontend
npm run build

# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod
```

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustchain
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
BLOCKCHAIN_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=0x...
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
VITE_BLOCKCHAIN_RPC_URL=http://localhost:8545
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=80001
```

## Architecture

### Blockchain Layers

1. **Public Layer (Ethereum/Polygon)**: Transparent transaction records
2. **Permissioned Layer (Hyperledger)**: Private KYC and sensitive data
3. **Sidechain (Polygon)**: Low-cost, high-speed transactions

### Smart Contracts

- **LoanContract.sol**: Loan creation, approval, repayment
- **ReputationSystem.sol**: Trust score calculation and tracking
- **DisputeResolution.sol**: Automated dispute handling
- **OfflineSync.sol**: Offline transaction settlement

### Backend Services

- **Authentication**: JWT-based auth with biometric support
- **Loan Management**: Create, approve, track loans
- **Reputation Engine**: Calculate trust scores, detect fraud
- **Payment Gateway**: UPI, Razorpay, Paytm integration
- **USSD Service**: Offline transaction support
- **Analytics**: Real-time dashboards for regulators

### Frontend Components

- **Dashboard**: Overview of loans, repayments, analytics
- **Loan Application**: Multi-step form with KYC
- **Reputation View**: Trust score and transaction history
- **Admin Panel**: Regulator and NGO monitoring tools
- **Offline Mode**: Service worker for offline functionality
- **Multi-language**: i18n support for 7+ languages

## API Documentation

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-biometric
```

### Loans

```
GET    /api/loans
POST   /api/loans
GET    /api/loans/:id
PUT    /api/loans/:id/approve
POST   /api/loans/:id/repay
```

### Reputation

```
GET    /api/reputation/:userId
POST   /api/reputation/update
GET    /api/reputation/fraud-check/:userId
```

### Payments

```
POST   /api/payments/create-order
POST   /api/payments/verify
GET    /api/payments/history/:userId
```

## Testing

```bash
# Smart contracts
cd contracts
npx hardhat test

# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## Security

- Smart contracts audited with OpenZeppelin standards
- JWT authentication with refresh tokens
- Rate limiting on all API endpoints
- Input validation and sanitization
- Encrypted data storage
- Regular security audits

## Compliance

- RBI microfinance guidelines
- KYC/AML verification via Onfido
- GDPR-compliant data handling
- Audit trails on blockchain
- Regular compliance reports

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

- Documentation: https://trustchain.docs
- Email: support@trustchain.io
- Discord: https://discord.gg/trustchain

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Voice interface for illiterate users
- [ ] Integration with more payment gateways
- [ ] Advanced ML fraud detection
- [ ] Multi-chain support (Solana, Cardano)
- [ ] Decentralized identity (DID)
- [ ] Insurance integration
- [ ] Micro-savings features

---

Built with ❤️ for financial inclusion in rural India

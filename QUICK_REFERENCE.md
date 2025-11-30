# TrustChain - Quick Reference Guide

## 🚀 Quick Commands

### Installation
```bash
# Windows
install.bat

# Manual installation
npm run install-all
```

### Development
```bash
# Terminal 1 - Blockchain
cd contracts
npx hardhat node

# Terminal 2 - Deploy Contracts
cd contracts
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3 - Backend
cd backend
npm run dev

# Terminal 4 - Frontend
cd frontend
npm run dev
```

### Testing
```bash
# Smart Contracts
cd contracts && npx hardhat test

# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# All tests
npm test
```

### Building
```bash
# Smart Contracts
cd contracts && npx hardhat compile

# Backend (no build needed)

# Frontend
cd frontend && npm run build
```

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustchain
JWT_SECRET=your-secret-key
BLOCKCHAIN_RPC_URL=http://localhost:8545
LOAN_CONTRACT_ADDRESS=0x...
REPUTATION_CONTRACT_ADDRESS=0x...
DISPUTE_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=0x...
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_BLOCKCHAIN_RPC_URL=http://localhost:8545
VITE_LOAN_CONTRACT_ADDRESS=0x...
VITE_REPUTATION_CONTRACT_ADDRESS=0x...
VITE_DISPUTE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=1337
```

---

## 🔗 Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **Blockchain RPC**: http://localhost:8545

---

## 📚 Key Files

### Smart Contracts
- `contracts/contracts/LoanContract.sol` - Loan management
- `contracts/contracts/ReputationSystem.sol` - Trust scoring
- `contracts/contracts/DisputeResolution.sol` - Dispute handling
- `contracts/scripts/deploy.js` - Deployment script

### Backend
- `backend/src/server.js` - Entry point
- `backend/src/routes/` - API endpoints
- `backend/src/models/` - Database models
- `backend/src/config/blockchain.js` - Blockchain integration

### Frontend
- `frontend/src/App.jsx` - Main app component
- `frontend/src/pages/` - Page components
- `frontend/src/components/Layout.jsx` - Layout wrapper
- `frontend/src/store/useAuthStore.js` - Auth state
- `frontend/src/i18n.js` - Translations

---

## 🎯 Common Tasks

### Add New API Endpoint
1. Create route in `backend/src/routes/`
2. Add to `backend/src/server.js`
3. Test with Postman/curl

### Add New Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `Layout.jsx`

### Add Translation
1. Edit `frontend/src/i18n.js`
2. Add key-value pairs for each language
3. Use `t('key')` in components

### Deploy Smart Contract Function
1. Add function to contract
2. Compile: `npx hardhat compile`
3. Update tests
4. Redeploy: `npx hardhat run scripts/deploy.js --network localhost`
5. Update contract addresses in .env files

---

## 🐛 Troubleshooting

### MetaMask Not Connecting
```
1. Check if MetaMask is installed
2. Add localhost network (Chain ID: 1337)
3. Import test account from Hardhat
4. Refresh page
```

### Backend Not Starting
```
1. Check MongoDB is running: mongod --version
2. Verify .env file exists
3. Check port 5000 is available
4. Review logs for errors
```

### Smart Contract Error
```
1. Ensure Hardhat node is running
2. Check contract addresses in .env
3. Verify you have ETH in wallet
4. Check gas limits
```

### Frontend Build Error
```
1. Delete node_modules and reinstall
2. Clear Vite cache: rm -rf .vite
3. Check .env file
4. Verify API URL is correct
```

---

## 📊 Database Collections

### users
```javascript
{
  walletAddress: String,
  name: String,
  email: String,
  phone: String,
  role: String,
  kycStatus: String,
  language: String
}
```

### loans
```javascript
{
  blockchainLoanId: String,
  borrower: ObjectId,
  lender: ObjectId,
  amount: Number,
  interestRate: Number,
  duration: Number,
  status: String
}
```

---

## 🔐 Default Test Accounts

Hardhat provides 20 test accounts with 10,000 ETH each:

**Account #0** (Deployer)
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Account #1**
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

---

## 📞 API Endpoints Quick Reference

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user

### Loans
- `POST /api/loans` - Create loan
- `GET /api/loans` - Get loans
- `GET /api/loans/:id` - Get loan
- `PUT /api/loans/:id/approve` - Approve
- `POST /api/loans/:id/repay` - Repay

### Reputation
- `GET /api/reputation/:address` - Get score
- `GET /api/reputation/me/score` - My score

### Disputes
- `POST /api/disputes` - Create
- `GET /api/disputes/:id` - Get details

---

## 🎨 UI Components

### Buttons
```jsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
```

### Cards
```jsx
<div className="card">
  <h3>Title</h3>
  <p>Content</p>
</div>
```

### Input Fields
```jsx
<input type="text" className="input-field" />
```

### Labels
```jsx
<label className="label">Field Name</label>
```

---

## 🔧 Useful Commands

### MongoDB
```bash
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use trustchain

# Show collections
show collections

# Query users
db.users.find()
```

### Git
```bash
# Clone repository
git clone <url>

# Create branch
git checkout -b feature/name

# Commit changes
git add .
git commit -m "message"

# Push changes
git push origin branch-name
```

### NPM
```bash
# Install package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update packages
npm update

# Check outdated
npm outdated

# Audit security
npm audit
```

---

## 📱 MetaMask Setup

### Add Local Network
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter details:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

### Import Account
1. Click account icon
2. Click "Import Account"
3. Paste private key from Hardhat
4. Click "Import"

---

## 🎓 Learning Resources

### Blockchain
- [Ethereum Docs](https://ethereum.org/en/developers/)
- [Solidity Docs](https://docs.soliditylang.org/)
- [Hardhat Docs](https://hardhat.org/)
- [OpenZeppelin](https://docs.openzeppelin.com/)

### Backend
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)

### Frontend
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Ethers.js](https://docs.ethers.org/)

---

## 📋 Checklist for New Developers

- [ ] Node.js 18+ installed
- [ ] MongoDB installed and running
- [ ] MetaMask extension installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm run install-all`)
- [ ] Environment files created
- [ ] Hardhat node running
- [ ] Contracts deployed
- [ ] Backend running
- [ ] Frontend running
- [ ] Test account imported to MetaMask
- [ ] Successfully connected wallet
- [ ] Created test loan
- [ ] Read documentation

---

## 🎯 Project Goals

1. **Accessibility**: Make microfinance accessible to rural India
2. **Transparency**: Blockchain-based transparent transactions
3. **Trust**: Build reputation through on-chain history
4. **Inclusion**: Multi-language support for diverse users
5. **Security**: Smart contract-based automated processes

---

## 📈 Key Metrics to Track

- Total users registered
- Loans created
- Loans approved
- Total disbursed amount
- Repayment rate
- Average trust score
- Default rate
- User growth rate

---

## 🔄 Development Workflow

1. **Create feature branch**
2. **Make changes**
3. **Write tests**
4. **Run tests locally**
5. **Commit with clear message**
6. **Push to GitHub**
7. **Create pull request**
8. **Code review**
9. **Merge to main**
10. **Deploy to production**

---

## 💡 Tips & Best Practices

- Always test on localhost before deploying
- Keep private keys secure (never commit)
- Use environment variables for sensitive data
- Write tests for new features
- Document your code
- Follow coding standards
- Review PRs carefully
- Monitor production logs
- Keep dependencies updated
- Regular security audits

---

**Quick Help**: For detailed information, see the full documentation in the `docs/` folder.

**Need Help?** Check SETUP_GUIDE.md or open an issue on GitHub.

**Last Updated**: 2025-10-10

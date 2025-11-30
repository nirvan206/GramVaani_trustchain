# TrustChain Setup Guide

Complete step-by-step guide to set up and run the TrustChain blockchain microfinance platform.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Redis** (optional, for caching) - [Download](https://redis.io/download)
- **MetaMask** browser extension - [Install](https://metamask.io/)

## Quick Start (5 Minutes)

```bash
# 1. Navigate to project directory
cd TrustChain

# 2. Install all dependencies
npm run install-all

# 3. Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start local blockchain (Terminal 1)
cd contracts
npx hardhat node

# 5. Deploy smart contracts (Terminal 2)
cd contracts
npx hardhat run scripts/deploy.js --network localhost

# 6. Start backend server (Terminal 3)
cd backend
npm run dev

# 7. Start frontend (Terminal 4)
cd frontend
npm run dev
```

Access the application at: **http://localhost:5173**

---

## Detailed Setup Instructions

### Step 1: Install Dependencies

#### 1.1 Install Root Dependencies
```bash
cd TrustChain
npm install
```

#### 1.2 Install Smart Contract Dependencies
```bash
cd contracts
npm install
```

#### 1.3 Install Backend Dependencies
```bash
cd ../backend
npm install
```

#### 1.4 Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

### Step 2: Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

---

### Step 3: Configure Environment Variables

#### 3.1 Backend Configuration (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/trustchain
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Blockchain (will be updated after deployment)
BLOCKCHAIN_RPC_URL=http://localhost:8545
CHAIN_ID=1337
LOAN_CONTRACT_ADDRESS=
REPUTATION_CONTRACT_ADDRESS=
DISPUTE_CONTRACT_ADDRESS=
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Payment Gateways (optional for now)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Twilio (optional for now)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Frontend
FRONTEND_URL=http://localhost:5173
```

**Note:** The `PRIVATE_KEY` above is from Hardhat's default accounts (for development only).

#### 3.2 Frontend Configuration (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_BLOCKCHAIN_RPC_URL=http://localhost:8545
VITE_LOAN_CONTRACT_ADDRESS=
VITE_REPUTATION_CONTRACT_ADDRESS=
VITE_DISPUTE_CONTRACT_ADDRESS=
VITE_CHAIN_ID=1337
```

---

### Step 4: Start Local Blockchain

Open a new terminal and run:

```bash
cd contracts
npx hardhat node
```

This will:
- Start a local Ethereum blockchain on `http://localhost:8545`
- Create 20 test accounts with 10,000 ETH each
- Display private keys and addresses

**Keep this terminal running!**

**Important:** Copy one of the account addresses and private keys for testing.

---

### Step 5: Deploy Smart Contracts

Open a new terminal and run:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

This will:
- Compile all smart contracts
- Deploy them to the local blockchain
- Save deployment addresses to `contracts/deployments/localhost-latest.json`

**Copy the contract addresses** displayed in the terminal.

#### 5.1 Update Environment Variables

Update both `backend/.env` and `frontend/.env` with the deployed contract addresses:

```env
# In backend/.env
LOAN_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REPUTATION_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
DISPUTE_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

# In frontend/.env
VITE_LOAN_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_REPUTATION_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VITE_DISPUTE_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

---

### Step 6: Configure MetaMask

1. **Install MetaMask** browser extension
2. **Add Local Network:**
   - Click MetaMask icon → Settings → Networks → Add Network
   - Network Name: `Localhost 8545`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
   - Click Save

3. **Import Test Account:**
   - Click MetaMask icon → Import Account
   - Paste one of the private keys from Hardhat node
   - You should see 10,000 ETH balance

---

### Step 7: Start Backend Server

Open a new terminal and run:

```bash
cd backend
npm run dev
```

This will:
- Start Express server on `http://localhost:5000`
- Connect to MongoDB
- Initialize blockchain service
- Set up API routes

**Keep this terminal running!**

You should see:
```
✅ MongoDB Connected: localhost
✅ Blockchain service initialized
🚀 TrustChain API server running on port 5000
```

---

### Step 8: Start Frontend

Open a new terminal and run:

```bash
cd frontend
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:5173`
- Enable hot module replacement

**Keep this terminal running!**

---

### Step 9: Access the Application

Open your browser and navigate to: **http://localhost:5173**

You should see the TrustChain homepage!

---

## Testing the Application

### 9.1 Register a New User

1. Click **"Get Started"** or **"Register"**
2. Click **"Connect Wallet"**
3. MetaMask will prompt you to connect - click **"Connect"**
4. Fill in your details:
   - Name: `Test User`
   - Email: `test@example.com` (optional)
   - Phone: `+91 9876543210` (optional)
   - Language: Select your preference
5. Click **"Register"**

You'll be redirected to the dashboard!

### 9.2 Apply for a Loan

1. Go to **Dashboard** → Click **"Apply for Loan"**
2. Fill in loan details:
   - Amount: `10000` (₹10,000)
   - Interest Rate: `12` (12% per annum)
   - Duration: `90` (90 days)
   - Purpose: Select `Small Business`
   - Collateral: `Shop equipment` (optional)
3. Click **"Submit Application"**
4. MetaMask will prompt you to sign the transaction - click **"Confirm"**

Your loan application is now on the blockchain!

### 9.3 View Loan Details

1. Go to **"My Loans"**
2. Click **"View Details"** on your loan
3. You'll see:
   - Loan summary
   - Status (Pending)
   - Blockchain transaction details

### 9.4 Check Reputation Score

1. Go to **"Reputation"**
2. You'll see:
   - Your trust score (starts at 500)
   - Loan statistics
   - Tips to improve score

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `backend/.env`
- Try: `mongodb://127.0.0.1:27017/trustchain`

### Issue: "MetaMask connection failed"
**Solution:**
- Ensure MetaMask is installed and unlocked
- Check if local network is added to MetaMask
- Verify Chain ID is `1337`

### Issue: "Contract deployment failed"
**Solution:**
- Ensure Hardhat node is running
- Check if you have sufficient ETH in deployer account
- Try restarting Hardhat node

### Issue: "Transaction failed"
**Solution:**
- Check if you have ETH in your MetaMask account
- Ensure you're connected to the correct network (Localhost 8545)
- Try resetting MetaMask account (Settings → Advanced → Reset Account)

### Issue: "Backend API not responding"
**Solution:**
- Check if MongoDB is running
- Verify contract addresses in `backend/.env`
- Check backend logs for errors
- Ensure port 5000 is not in use

### Issue: "Frontend not loading"
**Solution:**
- Clear browser cache
- Check if backend is running on port 5000
- Verify API URL in `frontend/.env`
- Try: `npm run dev` again

---

## Production Deployment

### Deploy to Polygon Mumbai Testnet

1. **Get MATIC tokens:**
   - Visit [Polygon Faucet](https://faucet.polygon.technology/)
   - Enter your wallet address
   - Receive free test MATIC

2. **Update `contracts/hardhat.config.js`:**
   ```javascript
   mumbai: {
     url: "https://rpc-mumbai.maticvigil.com",
     accounts: [process.env.PRIVATE_KEY],
     chainId: 80001
   }
   ```

3. **Deploy contracts:**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network mumbai
   ```

4. **Update environment variables** with new contract addresses

5. **Deploy backend** to Heroku, Railway, or AWS

6. **Deploy frontend** to Vercel or Netlify

---

## Additional Features to Implement

### 1. KYC Integration
- Integrate Onfido or Sumsub for identity verification
- Add document upload functionality
- Implement admin approval workflow

### 2. Payment Gateway
- Integrate Razorpay for INR payments
- Add UPI payment support
- Implement automatic loan disbursement

### 3. USSD Support
- Integrate Twilio or Africa's Talking
- Create USSD menu for feature phones
- Enable offline loan applications

### 4. Notifications
- Email notifications (SendGrid)
- SMS notifications (Twilio)
- Push notifications (Firebase)

### 5. Analytics Dashboard
- Admin dashboard for monitoring
- Loan approval workflow
- Fraud detection alerts

---

## Useful Commands

### Smart Contracts
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to localhost
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Verify contract on Polygonscan
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

### Backend
```bash
# Start development server
npm run dev

# Run tests
npm test

# Start production server
npm start
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Support

For issues or questions:
- Check the [README.md](README.md)
- Review the [troubleshooting section](#troubleshooting)
- Open an issue on GitHub

---

## Next Steps

1. ✅ Complete basic setup
2. ✅ Test loan application flow
3. ⏳ Implement KYC verification
4. ⏳ Add payment gateway integration
5. ⏳ Deploy to testnet
6. ⏳ Conduct user testing
7. ⏳ Deploy to production

---

**Congratulations! 🎉** You've successfully set up TrustChain!

Start building financial inclusion for rural India! 🚀

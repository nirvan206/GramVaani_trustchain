# TrustChain Deployment Guide

Complete guide for deploying TrustChain to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Smart Contract Deployment](#smart-contract-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Accounts

1. **Blockchain Network:**
   - Polygon Mumbai (Testnet) or Polygon Mainnet
   - Get MATIC tokens from [Polygon Faucet](https://faucet.polygon.technology/)

2. **Cloud Services:**
   - MongoDB Atlas (Database)
   - Heroku/Railway/AWS (Backend)
   - Vercel/Netlify (Frontend)

3. **External Services:**
   - Razorpay (Payment Gateway)
   - Twilio (SMS/USSD)
   - Onfido/Sumsub (KYC)
   - SendGrid (Email)

### Required Tools

```bash
# Install globally
npm install -g pm2
npm install -g vercel
npm install -g netlify-cli
```

---

## Smart Contract Deployment

### 1. Deploy to Polygon Mumbai Testnet

#### Step 1: Get MATIC Tokens

Visit [Polygon Faucet](https://faucet.polygon.technology/) and get test MATIC.

#### Step 2: Update Hardhat Config

Edit `contracts/hardhat.config.js`:

```javascript
mumbai: {
  url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
  accounts: [process.env.PRIVATE_KEY],
  chainId: 80001,
  gasPrice: 20000000000
}
```

#### Step 3: Set Environment Variables

Create `contracts/.env`:

```env
PRIVATE_KEY=your_wallet_private_key_here
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

#### Step 4: Deploy Contracts

```bash
cd contracts
npx hardhat run scripts/deploy.js --network mumbai
```

#### Step 5: Verify Contracts

```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

### 2. Deploy to Polygon Mainnet

**⚠️ Warning:** Only deploy to mainnet after thorough testing!

#### Step 1: Get Production MATIC

Purchase MATIC from exchanges (Binance, Coinbase, etc.)

#### Step 2: Update Config

```javascript
polygon: {
  url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
  accounts: [process.env.PRIVATE_KEY],
  chainId: 137,
  gasPrice: 50000000000
}
```

#### Step 3: Deploy

```bash
npx hardhat run scripts/deploy.js --network polygon
```

#### Step 4: Save Contract Addresses

Copy the deployed contract addresses and update all environment files.

---

## Backend Deployment

### Option 1: Deploy to Heroku

#### Step 1: Install Heroku CLI

```bash
# Windows
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### Step 2: Login to Heroku

```bash
heroku login
```

#### Step 3: Create Heroku App

```bash
cd backend
heroku create trustchain-api
```

#### Step 4: Add MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to Heroku config vars

```bash
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/trustchain"
```

#### Step 5: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set BLOCKCHAIN_RPC_URL=https://polygon-rpc.com
heroku config:set LOAN_CONTRACT_ADDRESS=0x...
heroku config:set REPUTATION_CONTRACT_ADDRESS=0x...
heroku config:set DISPUTE_CONTRACT_ADDRESS=0x...
heroku config:set PRIVATE_KEY=0x...
heroku config:set FRONTEND_URL=https://trustchain.vercel.app
```

#### Step 6: Deploy

```bash
git init
git add .
git commit -m "Initial deployment"
heroku git:remote -a trustchain-api
git push heroku main
```

#### Step 7: Scale Dynos

```bash
heroku ps:scale web=1
```

### Option 2: Deploy to Railway

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Login

```bash
railway login
```

#### Step 3: Initialize Project

```bash
cd backend
railway init
```

#### Step 4: Set Environment Variables

```bash
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set JWT_SECRET="your-secret"
# ... set all other variables
```

#### Step 5: Deploy

```bash
railway up
```

### Option 3: Deploy to AWS EC2

#### Step 1: Launch EC2 Instance

1. Go to AWS Console
2. Launch Ubuntu 22.04 LTS instance
3. Configure security groups (ports 22, 80, 443, 5000)

#### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### Step 4: Clone Repository

```bash
git clone https://github.com/your-repo/trustchain.git
cd trustchain/backend
npm install
```

#### Step 5: Set Environment Variables

```bash
nano .env
# Add all production variables
```

#### Step 6: Start with PM2

```bash
pm2 start src/server.js --name trustchain-api
pm2 save
pm2 startup
```

#### Step 7: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/trustchain
```

Add:

```nginx
server {
    listen 80;
    server_name api.trustchain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/trustchain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 8: Set Up SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.trustchain.com
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Configure Environment Variables

Create `frontend/.env.production`:

```env
VITE_API_URL=https://trustchain-api.herokuapp.com
VITE_BLOCKCHAIN_RPC_URL=https://polygon-rpc.com
VITE_LOAN_CONTRACT_ADDRESS=0x...
VITE_REPUTATION_CONTRACT_ADDRESS=0x...
VITE_DISPUTE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=137
```

#### Step 4: Deploy

```bash
cd frontend
vercel
```

Follow the prompts and select production deployment.

#### Step 5: Set Environment Variables in Vercel Dashboard

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all variables from `.env.production`

### Option 2: Deploy to Netlify

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login

```bash
netlify login
```

#### Step 3: Build Project

```bash
cd frontend
npm run build
```

#### Step 4: Deploy

```bash
netlify deploy --prod
```

#### Step 5: Set Environment Variables

```bash
netlify env:set VITE_API_URL "https://trustchain-api.herokuapp.com"
netlify env:set VITE_BLOCKCHAIN_RPC_URL "https://polygon-rpc.com"
# ... set all other variables
```

### Option 3: Deploy to AWS S3 + CloudFront

#### Step 1: Build Project

```bash
cd frontend
npm run build
```

#### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://trustchain-frontend
```

#### Step 3: Upload Build

```bash
aws s3 sync dist/ s3://trustchain-frontend --delete
```

#### Step 4: Configure S3 for Static Hosting

```bash
aws s3 website s3://trustchain-frontend --index-document index.html --error-document index.html
```

#### Step 5: Create CloudFront Distribution

1. Go to AWS CloudFront Console
2. Create distribution
3. Set origin to S3 bucket
4. Configure SSL certificate
5. Set custom domain

---

## Database Setup

### MongoDB Atlas Production Setup

#### Step 1: Create Production Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (M10 or higher for production)
3. Select region closest to your backend

#### Step 2: Configure Security

1. **Network Access:**
   - Add backend server IP
   - Or allow access from anywhere (0.0.0.0/0) if using cloud services

2. **Database Access:**
   - Create database user with strong password
   - Grant read/write access to specific database

#### Step 3: Get Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/trustchain?retryWrites=true&w=majority
```

#### Step 4: Create Indexes

Connect to database and create indexes:

```javascript
// Users collection
db.users.createIndex({ walletAddress: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { sparse: true })

// Loans collection
db.loans.createIndex({ blockchainLoanId: 1 }, { unique: true })
db.loans.createIndex({ borrower: 1 })
db.loans.createIndex({ lender: 1 })
db.loans.createIndex({ status: 1 })
```

### Redis Setup (Optional)

#### Option 1: Redis Cloud

1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Create free database
3. Get connection URL
4. Add to backend environment variables

#### Option 2: AWS ElastiCache

1. Create ElastiCache Redis cluster
2. Configure security groups
3. Get endpoint URL
4. Add to backend environment variables

---

## Monitoring & Maintenance

### 1. Application Monitoring

#### Sentry (Error Tracking)

```bash
npm install @sentry/node @sentry/react
```

**Backend:**
```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Frontend:**
```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

#### New Relic (Performance Monitoring)

```bash
npm install newrelic
```

Add to backend:
```javascript
require('newrelic');
```

### 2. Logging

#### CloudWatch (AWS)

```bash
npm install winston-cloudwatch
```

Configure Winston:
```javascript
const CloudWatchTransport = require('winston-cloudwatch');

logger.add(new CloudWatchTransport({
  logGroupName: 'trustchain-api',
  logStreamName: 'production',
  awsRegion: 'us-east-1',
}));
```

### 3. Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

### 4. Backup Strategy

#### MongoDB Backups

```bash
# Manual backup
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)

# Automated backups (MongoDB Atlas)
# Enable automated backups in Atlas dashboard
```

#### Smart Contract Backups

- Contract code is immutable on blockchain
- Keep deployment scripts and ABIs in version control
- Document all deployed contract addresses

### 5. Health Checks

Add health check endpoint:

```javascript
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok',
    checks: {
      database: 'checking',
      blockchain: 'checking',
    }
  };

  try {
    await mongoose.connection.db.admin().ping();
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'error';
  }

  try {
    await blockchainService.provider.getBlockNumber();
    health.checks.blockchain = 'ok';
  } catch (error) {
    health.checks.blockchain = 'error';
    health.status = 'error';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

---

## Post-Deployment Checklist

- [ ] Smart contracts deployed and verified
- [ ] Backend API running and accessible
- [ ] Frontend deployed and loading correctly
- [ ] Database connected and indexed
- [ ] Environment variables set correctly
- [ ] SSL certificates configured
- [ ] Monitoring tools configured
- [ ] Backup strategy implemented
- [ ] Health checks working
- [ ] Error tracking enabled
- [ ] Rate limiting configured
- [ ] CORS configured correctly
- [ ] API documentation updated
- [ ] Test transactions successful
- [ ] MetaMask connects properly
- [ ] Multi-language support working
- [ ] Payment gateway tested
- [ ] Email/SMS notifications working

---

## Rollback Procedure

If deployment fails:

1. **Backend:**
   ```bash
   # Heroku
   heroku rollback
   
   # PM2
   pm2 restart trustchain-api --update-env
   ```

2. **Frontend:**
   ```bash
   # Vercel
   vercel rollback
   
   # Netlify
   netlify rollback
   ```

3. **Smart Contracts:**
   - Cannot rollback (immutable)
   - Deploy new version if needed
   - Update contract addresses in backend/frontend

---

## Security Best Practices

1. **Never commit private keys or secrets**
2. **Use environment variables for all sensitive data**
3. **Enable 2FA on all service accounts**
4. **Regularly update dependencies**
5. **Use HTTPS everywhere**
6. **Implement rate limiting**
7. **Validate all user inputs**
8. **Use prepared statements for database queries**
9. **Regular security audits**
10. **Monitor for suspicious activity**

---

## Support & Troubleshooting

For deployment issues:

1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Check blockchain RPC status
5. Review security group settings
6. Verify SSL certificates
7. Check DNS configuration

---

**Last Updated:** 2025-10-10
**Version:** 1.0.0

# 🎨 TrustChain Demo Mode

## Quick Start - View UI with Dummy Data

You can now explore the **entire TrustChain platform** with dummy data - **no backend or blockchain needed**!

### Installation & Run

```bash
# Navigate to frontend
cd "c:\Users\Nirvan\Desktop\project 2\TrustChain\frontend"

# Install dependencies (first time only)
npm install

# Start the app
npm run dev
```

The app will open at: **http://localhost:5173**

---

## ✨ What's Included in Demo Mode

### 🔐 Auto-Login
- You're automatically logged in as **"Demo User"**
- No wallet connection needed
- No MetaMask required

### 💼 Pre-loaded Data

**3 Demo Loans:**
1. **Active Loan** - ₹50,000 for Small Business (₹15,000 repaid)
2. **Repaid Loan** - ₹25,000 for Agriculture (fully repaid)
3. **Pending Loan** - ₹30,000 for Education (awaiting approval)

**Reputation Score:**
- Trust Score: 750/1000
- Total Loans: 5
- Successful Loans: 4
- On-Time Payments: 12

---

## 🎯 Features You Can Try

### ✅ Dashboard
- View loan statistics
- See trust score
- Quick actions

### ✅ My Loans
- View all loans
- Filter by status (pending, active, repaid)
- Search loans

### ✅ Loan Details
- View complete loan information
- **Make repayments** (updates in real-time!)
- Track repayment progress

### ✅ Apply for Loan
- Fill out loan application form
- **Submit new loans** (added to your list!)
- See loan summary

### ✅ Reputation
- View trust score breakdown
- See detailed statistics
- Tips to improve score

### ✅ Profile
- View user information
- Edit profile (demo mode)
- Check KYC status

### ✅ Multi-Language
- Switch between 7+ languages
- English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati

---

## 🎮 Try These Actions

### 1. Make a Repayment
1. Go to **My Loans**
2. Click on the **Active Loan** (₹50,000)
3. Enter repayment amount (e.g., ₹10,000)
4. Click **Pay Now**
5. Watch the progress bar update!

### 2. Apply for New Loan
1. Click **Apply for Loan**
2. Fill in the form:
   - Amount: ₹20,000
   - Interest Rate: 12%
   - Duration: 60 days
   - Purpose: Select any
3. Click **Submit Application**
4. Check **My Loans** - your new loan is there!

### 3. Change Language
1. Click the **language selector** (top right)
2. Select **हिन्दी (Hindi)** or any other language
3. Watch the entire UI translate!

### 4. Explore Dashboard
1. Go to **Dashboard**
2. See your loan statistics
3. Check trust score
4. View recent loans

---

## 💾 Data Persistence

All demo data is saved in your browser's local storage:
- Your loans persist across page refreshes
- New loans you create stay there
- Repayments are remembered

**To reset demo data:**
1. Open browser console (F12)
2. Go to **Application** → **Local Storage**
3. Delete `trustchain-demo` and `trustchain-auth`
4. Refresh page

---

## 🚀 What Works in Demo Mode

✅ View all pages  
✅ Navigate between pages  
✅ Apply for loans  
✅ Make repayments  
✅ View loan details  
✅ Check reputation  
✅ Edit profile  
✅ Switch languages  
✅ Filter and search loans  
✅ Real-time UI updates  

---

## ❌ What Doesn't Work (Requires Full Setup)

❌ MetaMask wallet connection  
❌ Actual blockchain transactions  
❌ Real payment processing  
❌ Backend API calls  
❌ Smart contract interaction  
❌ KYC verification  
❌ Email/SMS notifications  

---

## 🔄 Switching to Full Mode

When you're ready to use the full blockchain features:

1. Follow the **SETUP_GUIDE.md**
2. Start MongoDB, blockchain, and backend
3. The app will automatically connect to real services

---

## 🎨 UI Preview

You can now see:
- **Modern, responsive design**
- **Beautiful gradients and colors**
- **Smooth animations**
- **Mobile-friendly layout**
- **Professional dashboard**
- **Intuitive forms**
- **Clear data visualization**

---

## 💡 Perfect For

- **Designers** - See the UI/UX
- **Stakeholders** - Demo the platform
- **Developers** - Test frontend without backend
- **Users** - Understand the flow
- **Presentations** - Show features quickly

---

## 🐛 Troubleshooting

**Issue: Page is blank**
- Check browser console for errors
- Make sure you ran `npm install`
- Try clearing browser cache

**Issue: Changes not saving**
- Check browser local storage
- Make sure JavaScript is enabled

**Issue: Styles not loading**
- Wait for Vite to compile
- Check terminal for errors

---

## 📱 Mobile Testing

The demo works great on mobile too!

1. Start the dev server
2. Find your local IP (run `ipconfig` in terminal)
3. Open `http://YOUR_IP:5173` on your phone
4. Explore the mobile-responsive design!

---

**Enjoy exploring TrustChain! 🚀**

For full blockchain features, see **SETUP_GUIDE.md**

# TrustChain API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "name": "John Doe",
    "role": "borrower",
    "kycStatus": "pending",
    "language": "en"
  }
}
```

---

### Login

**POST** `/auth/login`

Login with wallet address.

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "name": "John Doe",
    "role": "borrower",
    "kycStatus": "verified",
    "language": "en"
  }
}
```

---

### Get Current User

**GET** `/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "role": "borrower",
    "kycStatus": "verified",
    "language": "en",
    "location": {
      "state": "Maharashtra",
      "district": "Pune",
      "village": "Kharadi",
      "pincode": "411014"
    },
    "isActive": true,
    "createdAt": "2025-01-10T10:30:00.000Z",
    "lastLogin": "2025-01-15T14:20:00.000Z"
  }
}
```

---

### Update Profile

**PUT** `/auth/profile`

Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "+91 9876543210",
  "language": "hi"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "phone": "+91 9876543210",
    "language": "hi"
  }
}
```

---

## Loan Endpoints

### Create Loan Request

**POST** `/loans`

Create a new loan application.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 50000,
  "interestRate": 1200,
  "duration": 90,
  "purpose": "Small Business",
  "collateral": "Shop equipment worth ₹75,000"
}
```

**Response:**
```json
{
  "success": true,
  "loan": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "blockchainLoanId": "1",
    "borrower": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb"
    },
    "amount": 50000,
    "interestRate": 1200,
    "duration": 90,
    "purpose": "Small Business",
    "collateral": "Shop equipment worth ₹75,000",
    "status": "pending",
    "repaidAmount": 0,
    "createdAt": "2025-01-15T15:00:00.000Z"
  }
}
```

---

### Get All Loans

**GET** `/loans`

Get user's loans with optional filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, active, repaid, defaulted)
- `role` (optional): Filter by role (borrower, lender)

**Example:** `/loans?status=active&role=borrower`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "loans": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "blockchainLoanId": "1",
      "borrower": {
        "name": "John Doe",
        "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb"
      },
      "lender": {
        "name": "Jane Smith",
        "walletAddress": "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"
      },
      "amount": 50000,
      "interestRate": 1200,
      "duration": 90,
      "purpose": "Small Business",
      "status": "active",
      "repaidAmount": 15000,
      "createdAt": "2025-01-15T15:00:00.000Z",
      "approvedAt": "2025-01-16T10:00:00.000Z",
      "dueDate": "2025-04-16T10:00:00.000Z"
    }
  ]
}
```

---

### Get Loan Details

**GET** `/loans/:id`

Get detailed information about a specific loan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "loan": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "blockchainLoanId": "1",
    "borrower": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
      "email": "john@example.com",
      "phone": "+91 9876543210"
    },
    "lender": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "name": "Jane Smith",
      "walletAddress": "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
      "email": "jane@example.com"
    },
    "amount": 50000,
    "interestRate": 1200,
    "duration": 90,
    "purpose": "Small Business",
    "collateral": "Shop equipment worth ₹75,000",
    "status": "active",
    "repaidAmount": 15000,
    "totalDue": 56000,
    "createdAt": "2025-01-15T15:00:00.000Z",
    "approvedAt": "2025-01-16T10:00:00.000Z",
    "dueDate": "2025-04-16T10:00:00.000Z",
    "blockchainData": {
      "loanId": "1",
      "borrower": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
      "lender": "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
      "amount": "50000000000000000000000",
      "status": 2
    }
  }
}
```

---

### Approve Loan

**PUT** `/loans/:id/approve`

Approve and fund a loan (lender only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "loan": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "status": "approved",
    "lender": "65a1b2c3d4e5f6g7h8i9j0k3",
    "approvedAt": "2025-01-16T10:00:00.000Z",
    "dueDate": "2025-04-16T10:00:00.000Z"
  }
}
```

---

### Make Repayment

**POST** `/loans/:id/repay`

Make a repayment on an active loan.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 10000
}
```

**Response:**
```json
{
  "success": true,
  "loan": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "repaidAmount": 25000,
    "status": "active"
  },
  "remainingAmount": 31000,
  "message": "Repayment successful"
}
```

---

### Get Pending Loans

**GET** `/loans/pending/all`

Get all pending loan requests (for lenders).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "loans": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "blockchainLoanId": "3",
      "borrower": {
        "name": "Ramesh Kumar",
        "walletAddress": "0x123...",
        "location": {
          "state": "Maharashtra",
          "district": "Pune"
        }
      },
      "amount": 30000,
      "interestRate": 1000,
      "duration": 60,
      "purpose": "Agriculture",
      "createdAt": "2025-01-17T09:00:00.000Z"
    }
  ]
}
```

---

## Reputation Endpoints

### Get Reputation Score

**GET** `/reputation/:address`

Get reputation score for a specific wallet address.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "reputation": {
    "trustScore": "750",
    "totalLoans": "5",
    "successfulLoans": "4",
    "defaultedLoans": "0",
    "totalBorrowed": "200000.0",
    "totalRepaid": "180000.0",
    "onTimePayments": "12",
    "latePayments": "2",
    "lastUpdated": "1705492800",
    "isFraudulent": false
  }
}
```

---

### Get Current User's Reputation

**GET** `/reputation/me/score`

Get authenticated user's reputation score.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "reputation": {
    "trustScore": "750",
    "totalLoans": "5",
    "successfulLoans": "4",
    "defaultedLoans": "0",
    "totalBorrowed": "200000.0",
    "totalRepaid": "180000.0",
    "onTimePayments": "12",
    "latePayments": "2",
    "lastUpdated": "1705492800",
    "isFraudulent": false
  }
}
```

---

## Dispute Endpoints

### Create Dispute

**POST** `/disputes`

Create a new dispute for a loan.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "loanId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "reason": "Borrower claims payment was made but not reflected"
}
```

**Response:**
```json
{
  "success": true,
  "disputeId": "1",
  "message": "Dispute created successfully"
}
```

---

### Get Dispute Details

**GET** `/disputes/:id`

Get details of a specific dispute.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "dispute": {
    "disputeId": "1",
    "loanId": "1",
    "borrower": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "lender": "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
    "arbitrator": "0x0000000000000000000000000000000000000000",
    "reason": "Borrower claims payment was made but not reflected",
    "status": 0,
    "outcome": 0,
    "createdAt": "1705492800",
    "resolvedAt": "0",
    "resolution": "",
    "compensationAmount": "0.0"
  }
}
```

---

## Payment Endpoints

### Create Payment Order

**POST** `/payments/create-order`

Create a payment order for loan repayment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 10000,
  "loanId": "65a1b2c3d4e5f6g7h8i9j0k2"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "orderId": "order_1705492800123",
    "amount": 1000000,
    "currency": "INR",
    "loanId": "65a1b2c3d4e5f6g7h8i9j0k2"
  }
}
```

---

### Verify Payment

**POST** `/payments/verify`

Verify payment after completion.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "order_1705492800123",
  "paymentId": "pay_1705492800456",
  "signature": "abc123def456..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified"
}
```

---

## User Endpoints

### Get User by ID

**GET** `/users/:id`

Get user details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "borrower",
    "kycStatus": "verified",
    "language": "en",
    "isActive": true
  }
}
```

---

### Verify User KYC (Admin Only)

**PUT** `/users/:id/verify`

Verify user's KYC status (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "kycStatus": "verified"
  }
}
```

---

## Analytics Endpoints

### Get Dashboard Analytics (Admin Only)

**GET** `/analytics/dashboard`

Get platform-wide analytics (admin/arbitrator only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "loans": {
      "total": 150,
      "active": 45,
      "repaid": 90,
      "defaulted": 5,
      "pending": 10
    },
    "users": {
      "total": 500,
      "verified": 350
    },
    "financial": {
      "totalDisbursed": 5000000,
      "totalRepaid": 4200000
    }
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid input data",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be greater than 0"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "error": "User role borrower is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Default:** 100 requests per 15 minutes per IP
- **Authentication:** 5 requests per 15 minutes per IP
- **Loan creation:** 10 requests per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705493700
```

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Example:** `/loans?page=2&limit=10`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 2,
  "pages": 5,
  "loans": [...]
}
```

---

## Webhooks

TrustChain can send webhooks for important events:

### Events
- `loan.created`
- `loan.approved`
- `loan.repaid`
- `loan.defaulted`
- `dispute.created`
- `dispute.resolved`

### Webhook Payload
```json
{
  "event": "loan.approved",
  "timestamp": "2025-01-16T10:00:00.000Z",
  "data": {
    "loanId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "borrower": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "lender": "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
    "amount": 50000
  }
}
```

---

**Last Updated:** 2025-10-10
**API Version:** 1.0.0

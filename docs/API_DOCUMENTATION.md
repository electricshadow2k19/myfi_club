# MYFI API Documentation

Complete API documentation for MYFI Backend

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "phone": "9876543210",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "phone": "9876543210",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "phone": "9876543210",
  "password": "password123"
}
```

#### Send OTP
```http
POST /auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456"
}
```

### User Profile

#### Get Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "newemail@example.com"
}
```

### UPI Payments

#### Send Money
```http
POST /upi/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipient_upi": "user@paytm",
  "amount": 1000,
  "description": "Payment for services"
}
```

#### Get Transactions
```http
GET /upi/transactions?limit=50&offset=0
Authorization: Bearer <token>
```

### Bill Payments

#### Get Billers
```http
GET /bills/billers
Authorization: Bearer <token>
```

#### Fetch Bill
```http
POST /bills/fetch-bill
Authorization: Bearer <token>
Content-Type: application/json

{
  "biller_id": "electricity",
  "customer_id": "123456789"
}
```

#### Pay Bill
```http
POST /bills/pay
Authorization: Bearer <token>
Content-Type: application/json

{
  "biller_id": "electricity",
  "biller_name": "BSES",
  "bill_type": "electricity",
  "customer_id": "123456789",
  "amount": 1500
}
```

### Net Worth

#### Get Current Net Worth
```http
GET /networth/current
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "net_worth": 500000.00,
    "total_assets": 500000.00,
    "total_liabilities": 0.00,
    "breakdown": {
      "bank_balance": 200000.00,
      "mutual_funds": 250000.00,
      "gold": 50000.00
    }
  }
}
```

#### Get Net Worth History
```http
GET /networth/history?limit=30
Authorization: Bearer <token>
```

### Credit Score

#### Fetch Credit Score
```http
POST /credit-score/fetch
Authorization: Bearer <token>
Content-Type: application/json

{
  "provider": "crif"
}
```

#### Get Credit Score History
```http
GET /credit-score/history?limit=12
Authorization: Bearer <token>
```

### Mutual Funds

#### Search Funds
```http
GET /mutual-funds/search?query=sbi
Authorization: Bearer <token>
```

#### Create SIP
```http
POST /mutual-funds/sip/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "scheme_code": "SBI001",
  "scheme_name": "SBI Bluechip Fund",
  "amount": 5000,
  "sip_date": 5
}
```

### Gold

#### Get Gold Price
```http
GET /gold/price
Authorization: Bearer <token>
```

#### Buy Digital Gold
```http
POST /gold/buy/digital
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 10000
}
```

#### Get Gold Holdings
```http
GET /gold/holdings
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error


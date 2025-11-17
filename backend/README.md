# MYFI Backend API

Backend API server for MYFI - India's Personal Finance Super App

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Redis 6+ installed and running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Database credentials
   - Redis credentials
   - JWT secret
   - API keys for partners

4. Create database:
```sql
CREATE DATABASE myfi_db;
```

5. Run database migrations:
```bash
psql -U postgres -d myfi_db -f src/database/schema.sql
```

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/send-otp` - Send OTP
- `POST /api/v1/auth/verify-otp` - Verify OTP
- `POST /api/v1/auth/logout` - Logout

### User
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update profile
- `POST /api/v1/user/kyc/submit` - Submit KYC

### UPI
- `POST /api/v1/upi/send` - Send money via UPI
- `GET /api/v1/upi/transactions` - Get transaction history

### Bill Payments
- `GET /api/v1/bills/billers` - Get billers list
- `POST /api/v1/bills/fetch-bill` - Fetch bill details
- `POST /api/v1/bills/pay` - Pay bill

### Net Worth
- `GET /api/v1/networth/current` - Get current net worth
- `GET /api/v1/networth/history` - Get net worth history

### Credit Score
- `POST /api/v1/credit-score/fetch` - Fetch credit score
- `GET /api/v1/credit-score/history` - Get credit score history

### Mutual Funds
- `GET /api/v1/mutual-funds/search` - Search funds
- `POST /api/v1/mutual-funds/sip/create` - Create SIP

### Gold
- `GET /api/v1/gold/price` - Get gold price
- `POST /api/v1/gold/buy/digital` - Buy digital gold
- `GET /api/v1/gold/holdings` - Get gold holdings

## Environment Variables

See `.env.example` for all required environment variables.

## Development

The server runs on `http://localhost:3000` by default.

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Set up reverse proxy (Nginx)
4. Configure SSL certificates
5. Set up monitoring and logging


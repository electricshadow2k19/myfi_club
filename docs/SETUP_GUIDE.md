# MYFI Setup Guide

Complete setup guide for MYFI - India's Personal Finance Super App

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Create database: `myfi_db`

3. **Redis** (v6 or higher)
   - Download from: https://redis.io/download/
   - Start Redis server

4. **Flutter** (v3.0 or higher)
   - Download from: https://flutter.dev/docs/get-started/install
   - Verify: `flutter --version`

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
# Copy example file
cp .env.example .env

# Edit .env with your configuration
```

4. Update `.env` with:
   - Database credentials
   - Redis connection details
   - JWT secret (generate a strong random string)
   - API keys (when available)

5. Create PostgreSQL database:
```sql
CREATE DATABASE myfi_db;
```

6. Run database schema:
```bash
psql -U postgres -d myfi_db -f src/database/schema.sql
```

7. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

## Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install Flutter dependencies:
```bash
flutter pub get
```

3. Update API URL in `lib/services/api_service.dart`:
```dart
static const String baseUrl = 'http://YOUR_IP:3000/api/v1';
// For Android emulator, use: http://10.0.2.2:3000/api/v1
// For iOS simulator, use: http://localhost:3000/api/v1
```

4. Run the app:
```bash
# Android
flutter run

# iOS
flutter run -d ios
```

## Web App Setup

1. Navigate to web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Web app will run on `http://localhost:3001`

## Testing the Setup

1. **Backend Health Check:**
   - Visit: `http://localhost:3000/health`
   - Should return: `{"status":"ok"}`

2. **Register a User:**
   - Use Postman or mobile app
   - POST to: `http://localhost:3000/api/v1/auth/register`
   - Body: `{"phone":"9876543210","name":"Test User","password":"test123"}`

3. **Login:**
   - POST to: `http://localhost:3000/api/v1/auth/login`
   - Body: `{"phone":"9876543210","password":"test123"}`

## Common Issues

### Backend Issues

1. **Database Connection Error:**
   - Check PostgreSQL is running
   - Verify credentials in `.env`
   - Check database exists

2. **Redis Connection Error:**
   - Check Redis is running: `redis-cli ping`
   - Should return: `PONG`

3. **Port Already in Use:**
   - Change PORT in `.env`
   - Or kill process using port 3000

### Mobile App Issues

1. **API Connection Error:**
   - Check backend is running
   - Verify API URL in `api_service.dart`
   - For Android emulator, use `10.0.2.2` instead of `localhost`

2. **Build Errors:**
   - Run `flutter clean`
   - Run `flutter pub get`
   - Check Flutter version: `flutter --version`

## Next Steps

1. Integrate payment partners (Razorpay, UPI PSP)
2. Integrate credit score providers (CRIF, Experian)
3. Integrate mutual fund APIs (BSE Star MF)
4. Integrate gold partners (MMTC-PAMP, SafeGold)
5. Set up production environment
6. Configure CI/CD pipeline

## Production Deployment

See individual README files in:
- `backend/README.md` - Backend deployment
- `mobile/README.md` - Mobile app deployment
- `web/README.md` - Web app deployment


import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api/v1'; // Change to your API URL
  static const FlutterSecureStorage _storage = FlutterSecureStorage();
  static final Dio _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  ));

  static void init() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Add auth token to requests
        final token = await _storage.read(key: 'auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        // Handle errors
        if (error.response?.statusCode == 401) {
          // Token expired, logout user
          _storage.delete(key: 'auth_token');
        }
        return handler.next(error);
      },
    ));
  }

  // Auth APIs
  static Future<Response> register(Map<String, dynamic> data) {
    return _dio.post('/auth/register', data: data);
  }

  static Future<Response> login(Map<String, dynamic> data) {
    return _dio.post('/auth/login', data: data);
  }

  static Future<Response> sendOTP(String phone) {
    return _dio.post('/auth/send-otp', data: {'phone': phone});
  }

  static Future<Response> verifyOTP(String phone, String otp) {
    return _dio.post('/auth/verify-otp', data: {'phone': phone, 'otp': otp});
  }

  // User APIs
  static Future<Response> getProfile() {
    return _dio.get('/user/profile');
  }

  static Future<Response> updateProfile(Map<String, dynamic> data) {
    return _dio.put('/user/profile', data: data);
  }

  // UPI APIs
  static Future<Response> sendMoney(Map<String, dynamic> data) {
    return _dio.post('/upi/send', data: data);
  }

  static Future<Response> getUpiTransactions() {
    return _dio.get('/upi/transactions');
  }

  // Bill Payment APIs
  static Future<Response> getBillers() {
    return _dio.get('/bills/billers');
  }

  static Future<Response> fetchBill(Map<String, dynamic> data) {
    return _dio.post('/bills/fetch-bill', data: data);
  }

  static Future<Response> payBill(Map<String, dynamic> data) {
    return _dio.post('/bills/pay', data: data);
  }

  // Net Worth APIs
  static Future<Response> getNetWorth() {
    return _dio.get('/networth/current');
  }

  static Future<Response> getNetWorthHistory() {
    return _dio.get('/networth/history');
  }

  // Credit Score APIs
  static Future<Response> fetchCreditScore() {
    return _dio.post('/credit-score/fetch');
  }

  static Future<Response> getCreditScoreHistory() {
    return _dio.get('/credit-score/history');
  }

  // Mutual Funds APIs
  static Future<Response> searchFunds(String query) {
    return _dio.get('/mutual-funds/search', queryParameters: {'query': query});
  }

  static Future<Response> createSIP(Map<String, dynamic> data) {
    return _dio.post('/mutual-funds/sip/create', data: data);
  }

  // Gold APIs
  static Future<Response> getGoldPrice() {
    return _dio.get('/gold/price');
  }

  static Future<Response> buyDigitalGold(Map<String, dynamic> data) {
    return _dio.post('/gold/buy/digital', data: data);
  }

  static Future<Response> getGoldHoldings() {
    return _dio.get('/gold/holdings');
  }
}


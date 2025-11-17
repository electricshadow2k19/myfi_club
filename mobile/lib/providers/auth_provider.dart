import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  bool _isAuthenticated = false;
  Map<String, dynamic>? _user;

  bool get isAuthenticated => _isAuthenticated;
  Map<String, dynamic>? get user => _user;

  AuthProvider() {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    final token = await _storage.read(key: 'auth_token');
    if (token != null) {
      _isAuthenticated = true;
      await loadUserProfile();
    }
    notifyListeners();
  }

  Future<bool> register(String phone, String name, String email, String password) async {
    try {
      final response = await ApiService.register({
        'phone': phone,
        'name': name,
        'email': email,
        'password': password,
      });

      if (response.statusCode == 201) {
        final token = response.data['data']['token'];
        await _storage.write(key: 'auth_token', value: token);
        _isAuthenticated = true;
        _user = response.data['data']['user'];
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Register error: $e');
      return false;
    }
  }

  Future<bool> login(String phone, String password) async {
    try {
      final response = await ApiService.login({
        'phone': phone,
        'password': password,
      });

      if (response.statusCode == 200) {
        final token = response.data['data']['token'];
        await _storage.write(key: 'auth_token', value: token);
        _isAuthenticated = true;
        _user = response.data['data']['user'];
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Login error: $e');
      return false;
    }
  }

  Future<bool> sendOTP(String phone) async {
    try {
      final response = await ApiService.sendOTP(phone);
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Send OTP error: $e');
      return false;
    }
  }

  Future<bool> verifyOTP(String phone, String otp) async {
    try {
      final response = await ApiService.verifyOTP(phone, otp);
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Verify OTP error: $e');
      return false;
    }
  }

  Future<void> loadUserProfile() async {
    try {
      final response = await ApiService.getProfile();
      if (response.statusCode == 200) {
        _user = response.data['data'];
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Load profile error: $e');
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
    _isAuthenticated = false;
    _user = null;
    notifyListeners();
  }
}


import 'package:flutter/material.dart';
import '../services/api_service.dart';

class UpiProvider with ChangeNotifier {
  List<dynamic> _transactions = [];
  bool _isLoading = false;

  List<dynamic> get transactions => _transactions;
  bool get isLoading => _isLoading;

  Future<void> loadTransactions() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiService.getUpiTransactions();
      if (response.statusCode == 200) {
        _transactions = response.data['data'] ?? [];
      }
    } catch (e) {
      debugPrint('Load transactions error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> sendMoney(String recipientUpi, double amount, String description) async {
    try {
      final response = await ApiService.sendMoney({
        'recipient_upi': recipientUpi,
        'amount': amount,
        'description': description,
      });

      if (response.statusCode == 200) {
        await loadTransactions();
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Send money error: $e');
      return false;
    }
  }
}


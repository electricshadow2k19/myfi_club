import 'package:flutter/material.dart';
import '../services/api_service.dart';

class NetWorthProvider with ChangeNotifier {
  Map<String, dynamic>? _netWorth;
  List<dynamic> _history = [];
  bool _isLoading = false;

  Map<String, dynamic>? get netWorth => _netWorth;
  List<dynamic> get history => _history;
  bool get isLoading => _isLoading;

  Future<void> loadNetWorth() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiService.getNetWorth();
      if (response.statusCode == 200) {
        _netWorth = response.data['data'];
      }
    } catch (e) {
      debugPrint('Load net worth error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadHistory() async {
    try {
      final response = await ApiService.getNetWorthHistory();
      if (response.statusCode == 200) {
        _history = response.data['data'] ?? [];
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Load history error: $e');
    }
  }
}


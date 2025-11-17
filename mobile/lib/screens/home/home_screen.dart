import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/networth_provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_theme.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<NetWorthProvider>(context, listen: false).loadNetWorth();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: const [
          _HomeTab(),
          _InvestmentsTab(),
          _BillsTab(),
          _ProfileTab(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.trending_up), label: 'Invest'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt), label: 'Bills'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class _HomeTab extends StatelessWidget {
  const _HomeTab();

  @override
  Widget build(BuildContext context) {
    final netWorthProvider = Provider.of<NetWorthProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);

    return RefreshIndicator(
      onRefresh: () => netWorthProvider.loadNetWorth(),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: AppTheme.primaryColor,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(24),
                  bottomRight: Radius.circular(24),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Hello, ${authProvider.user?['name'] ?? 'User'}',
                    style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Your Financial Command Center',
                    style: TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Net Worth Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Net Worth',
                        style: TextStyle(fontSize: 14, color: Colors.grey),
                      ),
                      const SizedBox(height: 8),
                      if (netWorthProvider.isLoading)
                        const CircularProgressIndicator()
                      else
                        Text(
                          '₹${netWorthProvider.netWorth?['net_worth']?.toStringAsFixed(2) ?? '0.00'}',
                          style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                        ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => context.push('/networth'),
                        child: const Text('View Details'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            
            // Quick Actions
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Quick Actions',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.5,
                    children: [
                      _QuickActionCard(
                        icon: Icons.account_balance_wallet,
                        title: 'UPI',
                        color: Colors.blue,
                        onTap: () => context.push('/upi'),
                      ),
                      _QuickActionCard(
                        icon: Icons.receipt_long,
                        title: 'Pay Bills',
                        color: Colors.green,
                        onTap: () => context.push('/bills'),
                      ),
                      _QuickActionCard(
                        icon: Icons.trending_up,
                        title: 'Mutual Funds',
                        color: Colors.orange,
                        onTap: () => context.push('/mutual-funds'),
                      ),
                      _QuickActionCard(
                        icon: Icons.monetization_on,
                        title: 'Gold',
                        color: Colors.amber,
                        onTap: () => context.push('/gold'),
                      ),
                      _QuickActionCard(
                        icon: Icons.credit_score,
                        title: 'Credit Score',
                        color: Colors.purple,
                        onTap: () => context.push('/credit-score'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.title,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }
}

class _InvestmentsTab extends StatelessWidget {
  const _InvestmentsTab();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Investments')),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.trending_up),
            title: const Text('Mutual Funds'),
            subtitle: const Text('Start SIP or invest lumpsum'),
            onTap: () => context.push('/mutual-funds'),
          ),
          ListTile(
            leading: const Icon(Icons.monetization_on),
            title: const Text('Gold'),
            subtitle: const Text('Buy digital or physical gold'),
            onTap: () => context.push('/gold'),
          ),
        ],
      ),
    );
  }
}

class _BillsTab extends StatelessWidget {
  const _BillsTab();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bills')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => context.push('/bills'),
          child: const Text('View All Bills'),
        ),
      ),
    );
  }
}

class _ProfileTab extends StatelessWidget {
  const _ProfileTab();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => context.push('/profile'),
          child: const Text('View Profile'),
        ),
      ),
    );
  }
}

// Import AppTheme
import '../../theme/app_theme.dart';


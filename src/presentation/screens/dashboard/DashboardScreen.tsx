// Dashboard Screen — role-scoped
import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../../store/authStore';
import { useReportsStore } from '../../../store/reportsStore';
import { useSyncStore } from '../../../store/syncStore';
import { UserRole } from '../../../domain/entities/UserRole';
import { Colors, Spacing } from '../../../theme';
import { StatCard } from './components/StatCard';
import { ReportCard } from '../reports/components/ReportCard';
import { FAB } from '../../components/FAB';
import { Badge, BadgeVariant } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { greetingByHour, todayLabel } from '../../../utils/dates';
import { RootStackParamList } from '../../../core/navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

function roleBadgeVariant(role: UserRole): BadgeVariant {
  if (role === UserRole.SuperAdmin) return 'superAdmin';
  if (role === UserRole.Admin) return 'admin';
  return 'employee';
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { user } = useAuthStore();
  const { reports, fetchReports, isLoading, pendingCount, todayCount, refreshCounts } = useReportsStore();
  const { sync, isSyncing, pendingCount: syncPending } = useSyncStore();

  const isEmployee = user?.role === UserRole.Employee;
  const isAdmin = user?.role === UserRole.Admin;
  const isSuperAdmin = user?.role === UserRole.SuperAdmin;

  const load = useCallback(async () => {
    const filters = isEmployee ? { userId: user?.id, limit: 3 } : { limit: 5 };
    await fetchReports(filters);
    await refreshCounts(isEmployee ? user?.id : undefined);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const recentReports = reports.slice(0, isEmployee ? 3 : 5);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isSyncing}
            onRefresh={async () => { await sync(); await load(); }}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greetingByHour()}, {user?.fullName?.split(' ')[0]} 👋</Text>
            <Text style={styles.dateLabel}>{todayLabel()}</Text>
          </View>
          <View style={styles.headerRight}>
            <Badge variant={roleBadgeVariant(user!.role)} />
            {syncPending > 0 && (
              <View style={styles.syncChip}>
                <View style={styles.syncDot} />
                <Text style={styles.syncText}>{syncPending} pending</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statGrid}>
          <StatCard value={todayCount} label="Today's reports" />
          <StatCard value={pendingCount} label="Not synced" positive={pendingCount === 0} />
        </View>

        {/* Recent Reports */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {isEmployee ? 'Your recent reports' : 'Recent team reports'}
          </Text>
          {recentReports.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No reports yet"
              subtitle="Tap + to submit your first daily report"
            />
          ) : (
            recentReports.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                showUser={!isEmployee}
                onPress={() => navigation.navigate('ReportDetail', { reportId: r.id })}
              />
            ))
          )}
        </View>

        {isSuperAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Branches</Text>
            {['North Branch', 'Central Branch', 'South Branch'].map((b) => (
              <View key={b} style={styles.branchRow}>
                <Text style={styles.branchName}>{b}</Text>
                <Badge variant="synced" label="Active" />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <FAB onPress={() => navigation.navigate('CreateReport')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.screenH, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: Spacing.s4,
    marginBottom: Spacing.s6,
  },
  headerRight: { alignItems: 'flex-end', gap: 6 },
  greeting: { fontSize: 18, fontWeight: '500', color: Colors.textPrimary },
  dateLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  syncChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pendingBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5,
  },
  syncDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.warning },
  syncText: { fontSize: 11, color: Colors.warning, fontWeight: '500' },
  statGrid: { flexDirection: 'row', gap: Spacing.s2, marginBottom: Spacing.s6 },
  section: { marginBottom: Spacing.s6 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: Spacing.s2,
  },
  branchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderSubtle,
  },
  branchName: { fontSize: 14, color: Colors.textSecondary },
});

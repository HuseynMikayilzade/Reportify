// Reports List Screen
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl,
  TouchableOpacity, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../../store/authStore';
import { useReportsStore } from '../../../store/reportsStore';
import { UserRole } from '../../../domain/entities/UserRole';
import { SyncStatus } from '../../../domain/entities/SyncStatus';
import { ReportCard } from './components/ReportCard';
import { FAB } from '../../components/FAB';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import { Toast } from '../../components/Toast';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import { RootStackParamList } from '../../../core/navigation/types';
import { Report } from '../../../domain/entities/Report';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type Filter = 'All' | 'Pending' | 'Synced' | 'This week';

const FILTERS: Filter[] = ['All', 'Pending', 'Synced', 'This week'];

export default function ReportsListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { user } = useAuthStore();
  const { reports, fetchReports, deleteReport, isLoading } = useReportsStore();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; msg: string }>({
    visible: false, type: 'success', msg: '',
  });

  const isEmployee = user?.role === UserRole.Employee;

  const load = useCallback(() => {
    const userId = isEmployee ? user?.id : undefined;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    fetchReports({
      userId,
      fromDate: activeFilter === 'This week' ? oneWeekAgo : undefined,
      syncStatus:
        activeFilter === 'Pending' ? SyncStatus.Pending :
        activeFilter === 'Synced' ? SyncStatus.Synced : undefined,
    });
  }, [user, activeFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = reports.filter((r) =>
    search.trim() === '' ? true :
    (r.notes?.toLowerCase() || '').includes(search.toLowerCase()) ||
    r.shift.toLowerCase().includes(search.toLowerCase()) ||
    r.userFullName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleLongPress = (report: Report) => {
    Alert.alert('Report options', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteReport(report.id);
          setToast({ visible: true, type: 'success', msg: 'Report deleted' });
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity style={styles.filterIcon}>
          <Text style={styles.filterIconText}>⊟</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      {/* Filter Chips */}
      <View style={styles.chips}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
          >
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={load} tintColor={Colors.primary} />
        }
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            showUser={!isEmployee}
            onPress={() => navigation.navigate('ReportDetail', { reportId: item.id })}
            onLongPress={() => handleLongPress(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon={search ? '🔍' : '📋'}
            title={search ? 'No matching reports' : 'No reports yet'}
            subtitle={search ? 'Try a different search' : 'Tap + to submit your first report'}
          />
        }
      />

      <FAB onPress={() => navigation.navigate('CreateReport')} />

      <Toast
        visible={toast.visible}
        type={toast.type}
        title={toast.msg}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.s4,
    paddingBottom: Spacing.s3,
  },
  title: { fontSize: 22, fontWeight: '500', color: Colors.textPrimary },
  filterIcon: { padding: 4 },
  filterIconText: { fontSize: 20, color: Colors.textMuted },
  searchRow: { paddingHorizontal: Spacing.screenH, marginBottom: Spacing.s3 },
  chips: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenH,
    gap: Spacing.s2,
    marginBottom: Spacing.s3,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: Colors.overlay,
  },
  chipActive: {
    backgroundColor: Colors.primaryGhost,
    borderColor: Colors.primaryBorder,
  },
  chipText: { fontSize: 11, color: Colors.textMuted },
  chipTextActive: { color: '#9D94FF', fontWeight: '500' },
  list: {
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 120,
  },
});

// Statistics Screen
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { UserRole } from '../../../domain/entities/UserRole';
import { SegmentedControl } from '../../components/SegmentedControl';
import { ProgressBar } from '../../components/ProgressBar';
import { StatCard } from '../dashboard/components/StatCard';
import { EmptyState } from '../../components/EmptyState';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import {
  GetWeeklyStatsUseCase,
  GetDailyStatsUseCase,
  GetMonthlyStatsUseCase,
  StatsResult,
} from '../../../domain/usecases/stats/StatsUseCases';
import { ReportRepository } from '../../../data/repositories/ReportRepository';

const reportRepo = new ReportRepository();
const dailyUseCase = new GetDailyStatsUseCase(reportRepo);
const weeklyUseCase = new GetWeeklyStatsUseCase(reportRepo);
const monthlyUseCase = new GetMonthlyStatsUseCase(reportRepo);

type Period = 'Daily' | 'Weekly' | 'Monthly';
const PERIODS: Period[] = ['Daily', 'Weekly', 'Monthly'];

const { width } = Dimensions.get('window');
const CHART_W = width - Spacing.screenH * 2;
const BAR_MAX_H = 80;

function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <View style={chart.row}>
      {data.map((d, i) => {
        const barH = Math.max((d.count / max) * BAR_MAX_H, 4);
        const isToday = i === data.length - 1;
        return (
          <View key={d.date} style={chart.col}>
            <View
              style={[
                chart.bar,
                {
                  height: barH,
                  backgroundColor: isToday ? Colors.primary : 'rgba(124,111,255,0.30)',
                },
              ]}
            />
            <Text style={chart.label}>{d.date}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const isEmployee = user?.role === UserRole.Employee;

  const [period, setPeriod] = useState<Period>('Weekly');
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = isEmployee ? user?.id : undefined;
    setLoading(true);
    const load = async () => {
      try {
        let result: StatsResult;
        if (period === 'Daily') result = await dailyUseCase.execute(userId);
        else if (period === 'Monthly') result = await monthlyUseCase.execute(userId);
        else result = await weeklyUseCase.execute(userId);
        setStats(result);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period, user]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Period toggle */}
        <View style={styles.toggleRow}>
          <SegmentedControl options={PERIODS} selected={period} onSelect={setPeriod} />
        </View>

        {stats && stats.total === 0 ? (
          <EmptyState
            icon="📊"
            title="Not enough data yet"
            subtitle="Keep submitting reports to see statistics here"
          />
        ) : (
          <>
            {/* Bar chart card */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Reports submitted</Text>
              {stats && stats.byDay.length > 0 ? (
                <MiniBarChart data={stats.byDay} />
              ) : (
                <View style={{ height: BAR_MAX_H + 24, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Loading…</Text>
                </View>
              )}
            </View>

            {/* Sync rate card */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Sync rate this {period.toLowerCase()}</Text>
              <View style={{ marginBottom: Spacing.s2 }}>
                <ProgressBar progress={(stats?.syncRate ?? 0) / 100} />
              </View>
              <Text style={styles.syncRateLabel}>{stats?.syncRate ?? 0}% synced</Text>
            </View>

            {/* Stat grid */}
            <View style={styles.grid}>
              <StatCard
                value={stats?.total ?? 0}
                label="Total reports"
              />
              <StatCard
                value={`${stats?.syncRate ?? 0}%`}
                label="Sync rate"
                delta={stats && stats.syncRate >= 80 ? '↑ Good' : '↓ Low'}
                positive={stats ? stats.syncRate >= 80 : true}
              />
            </View>
            <View style={styles.grid}>
              <StatCard value={stats?.syncedCount ?? 0} label="Synced" />
              <StatCard
                value={stats?.pendingCount ?? 0}
                label="Pending"
                positive={stats?.pendingCount === 0}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.s4,
    paddingBottom: Spacing.s3,
  },
  title: { fontSize: 22, fontWeight: '500', color: Colors.textPrimary },
  scroll: { paddingHorizontal: Spacing.screenH, paddingBottom: 100 },
  toggleRow: { marginBottom: Spacing.s5 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.cardPadH,
    marginBottom: Spacing.s4,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '500', color: Colors.textMuted,
    letterSpacing: 0.7, textTransform: 'uppercase',
    marginBottom: Spacing.s4,
  },
  syncRateLabel: { fontSize: 12, color: Colors.textMuted },
  grid: { flexDirection: 'row', gap: Spacing.s2, marginBottom: Spacing.s2 },
});

const chart = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: BAR_MAX_H + 24,
    gap: 4,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 6,
  },
  label: { fontSize: 10, color: Colors.textMuted },
});

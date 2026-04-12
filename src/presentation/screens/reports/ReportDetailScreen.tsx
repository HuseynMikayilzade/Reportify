// Report Detail Screen
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../core/navigation/types';
import { useReportsStore } from '../../../store/reportsStore';
import { Badge, BadgeVariant } from '../../components/Badge';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import { SyncStatus } from '../../../domain/entities/SyncStatus';
import { Report } from '../../../domain/entities/Report';
import { formatTimestamp } from '../../../utils/dates';

type RouteT = RouteProp<RootStackParamList, 'ReportDetail'>;

function syncVariant(s: SyncStatus): BadgeVariant {
  if (s === SyncStatus.Synced) return 'synced';
  if (s === SyncStatus.Failed) return 'failed';
  return 'pending';
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

export default function ReportDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const { reports } = useReportsStore();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const found = reports.find((r) => r.id === route.params.reportId) ?? null;
    setReport(found);
  }, [route.params.reportId, reports]);

  if (!report) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={{ color: Colors.textMuted }}>Report not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Report Detail</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroShift}>{report.shift} Shift</Text>
              <Text style={styles.heroDate}>{formatTimestamp(report.createdAt)}</Text>
            </View>
            <Badge variant={syncVariant(report.syncStatus)} />
          </View>
          <Text style={styles.heroAuthor}>by {report.userFullName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Stock Overview</Text>
          {report.stock?.map((s, idx) => (
             <View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4}}>
               <Text style={styles.fieldValue}>{s.productName}</Text>
               <Text style={styles.fieldValue}>In: {s.receivedQty} | Out: {s.deliveredQty}</Text>
             </View>
          ))}
          <View style={styles.divider} />
          
          <Text style={styles.fieldLabel}>Sales</Text>
          {report.sales?.map((s, idx) => (
             <View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4}}>
               <Text style={styles.fieldValue}>{s.productName}</Text>
               <Text style={styles.fieldValue}>Qty: {s.quantity}</Text>
             </View>
          ))}
          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>Expenses</Text>
          {report.expenses?.map((e, idx) => (
             <View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4}}>
               <Text style={styles.fieldValue}>{e.name} {e.description ? `(${e.description})` : ''}</Text>
               <Text style={styles.fieldValue}>${e.amount}</Text>
             </View>
          ))}
          {report.notes && (
            <>
              <View style={styles.divider} />
              <Field label="Notes" value={report.notes} />
            </>
          )}
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>ID: {report.id.slice(0, 8)}…</Text>
          <Text style={styles.metaText}>
            Updated: {formatTimestamp(report.updatedAt)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.s3,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.overlay,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 22, color: Colors.textSecondary, marginTop: -2 },
  topTitle: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  scroll: { padding: Spacing.screenH, paddingBottom: 60 },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.s5,
    marginBottom: Spacing.s4,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroShift: { fontSize: 20, fontWeight: '500', color: Colors.textPrimary },
  heroDate: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  heroAuthor: { fontSize: 12, color: Colors.primary, marginTop: Spacing.s2 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.cardPadH,
    paddingVertical: Spacing.cardPadV,
    marginBottom: Spacing.s4,
  },
  field: { paddingVertical: Spacing.s3 },
  fieldLabel: {
    fontSize: 11, fontWeight: '500', color: Colors.textMuted,
    letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: Spacing.s2,
  },
  fieldValue: {
    fontSize: 14, color: Colors.textSecondary, lineHeight: 22,
  },
  divider: {
    height: 0.5, backgroundColor: Colors.borderSubtle,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: { fontSize: 10, color: Colors.textMuted },
});

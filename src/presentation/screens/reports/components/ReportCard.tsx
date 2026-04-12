// ReportCard component — used in list and dashboard
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Report } from '../../../../domain/entities/Report';
import { SyncStatus } from '../../../../domain/entities/SyncStatus';
import { Badge, BadgeVariant } from '../../../components/Badge';
import { Colors, Spacing, BorderRadius } from '../../../../theme';
import { formatTimestamp } from '../../../../utils/dates';

function syncBadgeVariant(status: SyncStatus): BadgeVariant {
  if (status === SyncStatus.Synced) return 'synced';
  if (status === SyncStatus.Failed) return 'failed';
  return 'pending';
}

interface ReportCardProps {
  report: Report;
  onPress?: () => void;
  onLongPress?: () => void;
  showUser?: boolean;
}

export function ReportCard({ report, onPress, onLongPress, showUser = false }: ReportCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.99, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={styles.row}>
          <View style={styles.titleGroup}>
            <Text style={styles.title} numberOfLines={1}>
              {report.shift} Shift
            </Text>
            {showUser && (
              <Text style={styles.userName}>{report.userFullName}</Text>
            )}
            <Text style={styles.date}>{formatTimestamp(report.createdAt)}</Text>
          </View>
          <Badge variant={syncBadgeVariant(report.syncStatus)} />
        </View>
        <Text style={styles.preview} numberOfLines={2}>
          {report.notes || 'No additional notes'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.overlay,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadH,
    paddingVertical: Spacing.cardPadV,
    marginBottom: Spacing.s2,
    gap: Spacing.s2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleGroup: { flex: 1, marginRight: Spacing.s2 },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  userName: {
    fontSize: 11,
    color: Colors.primary,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  preview: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.50)',
    lineHeight: 20,
  },
});

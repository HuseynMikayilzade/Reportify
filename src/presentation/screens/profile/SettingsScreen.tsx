// Profile / Settings Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { useSyncStore } from '../../../store/syncStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { Badge, BadgeVariant } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Toast } from '../../components/Toast';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import { UserRole } from '../../../domain/entities/UserRole';
import { formatTimestamp } from '../../../utils/dates';
import TabIconConfigScreen from './TabIconConfigScreen';

type SettingsView = 'settings' | 'icon-config';

function roleBadgeVariant(role: UserRole): BadgeVariant {
  if (role === UserRole.SuperAdmin) return 'superAdmin';
  if (role === UserRole.Admin) return 'admin';
  return 'employee';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function SettingRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={setting.row}>
      <Text style={setting.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: 'rgba(255,255,255,0.10)', true: 'rgba(124,111,255,0.50)' }}
        thumbColor={value ? '#9D94FF' : 'rgba(255,255,255,0.40)'}
        ios_backgroundColor="rgba(255,255,255,0.10)"
      />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={setting.row}>
      <Text style={setting.label}>{label}</Text>
      <Text style={setting.value}>{value}</Text>
    </View>
  );
}

export default function SettingsScreen() {

  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { sync, isSyncing, lastSyncAt, pendingCount } = useSyncStore();

  const { notificationsOn, autoSync, offlineMode, setNotifications, setAutoSync, setOfflineMode } = useSettingsStore();
  const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; msg: string }>({
    visible: false, type: 'success', msg: '',
  });

  // Internal navigation for sub-screens
  const [view, setView] = useState<SettingsView>('settings');

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const handleManualSync = async () => {
    const result = await sync();
    if (result.synced > 0) {
      setToast({ visible: true, type: 'success', msg: `${result.synced} report(s) synced successfully` });
    } else if (result.failed > 0) {
      setToast({ visible: true, type: 'error', msg: `${result.failed} report(s) failed to sync` });
    } else {
      setToast({ visible: true, type: 'info' as any, msg: 'Nothing to sync right now' });
    }
  };

  if (!user) return null;

  // Icon config sub-screen
  if (view === 'icon-config') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setView('settings')} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.subTitle}>Tab Icons</Text>
          <View style={{ width: 40 }} />
        </View>
        <TabIconConfigScreen />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>


      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
          </View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.badgeRow}>
            <Badge variant={roleBadgeVariant(user.role)} />
            {user.branch && <Badge variant="employee" label={user.branch} />}
          </View>
        </View>

        {/* Account info */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.card}>
          <InfoRow label="Full name" value={user.fullName} />
          <View style={styles.divider} />
          <InfoRow label="Email" value={user.email} />
          <View style={styles.divider} />
          <InfoRow label="Role" value={user.role} />
          {user.branch && (
            <>
              <View style={styles.divider} />
              <InfoRow label="Branch" value={user.branch} />
            </>
          )}
        </View>

        {/* Sync status */}
        <Text style={styles.sectionLabel}>Sync</Text>
        <View style={styles.card}>
          <InfoRow label="Pending reports" value={String(pendingCount)} />
          <View style={styles.divider} />
          <InfoRow
            label="Last synced"
            value={lastSyncAt ? formatTimestamp(lastSyncAt) : 'Never'}
          />
          <View style={styles.divider} />
          <TouchableOpacity onPress={handleManualSync} disabled={isSyncing} style={setting.row}>
            <Text style={setting.label}>Sync now</Text>
            <Text style={[setting.value, { color: Colors.primary }]}>
              {isSyncing ? 'Syncing…' : '↻'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.card}>
          <SettingRow
            label="Notifications"
            value={notificationsOn}
            onToggle={() => setNotifications(!notificationsOn)}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Auto-sync on WiFi"
            value={autoSync}
            onToggle={() => setAutoSync(!autoSync)}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Offline mode"
            value={offlineMode}
            onToggle={() => setOfflineMode(!offlineMode)}
          />
        </View>

        {/* Navigation Preferences */}
        <Text style={styles.sectionLabel}>Navigation</Text>
        <View style={styles.card}>
          <TouchableOpacity style={setting.navRow} onPress={() => setView('icon-config')}>
            <Text style={setting.label}>Tab Icons</Text>
            <Text style={setting.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <Button
          label="Sign out"
          onPress={handleLogout}
          variant="destructive"
          style={styles.signOut}
        />

        <Text style={styles.version}>Reportify v1.0.0 · Dark only</Text>
      </ScrollView>

      <Toast
        visible={toast.visible}
        type={toast.type as any}
        title={toast.msg}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
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
  avatarSection: { alignItems: 'center', marginVertical: Spacing.s6 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.avatar,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: { fontSize: 22, fontWeight: '500', color: Colors.white },
  name: { fontSize: 16, fontWeight: '500', color: Colors.textPrimary, marginBottom: 4 },
  email: { fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.s3 },
  badgeRow: { flexDirection: 'row', gap: Spacing.s2 },
  sectionLabel: {
    fontSize: 11, fontWeight: '500', color: Colors.textMuted,
    letterSpacing: 0.7, textTransform: 'uppercase',
    marginBottom: Spacing.s2, marginTop: Spacing.s4,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.cardPadH,
  },
  divider: { height: 0.5, backgroundColor: Colors.borderSubtle },
  signOut: { marginTop: Spacing.s6 },
  version: {
    textAlign: 'center', fontSize: 10,
    color: Colors.textMuted, marginTop: Spacing.s4,
  },
  // Sub-screen header (matches ManagementScreen pattern)
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.s3,
    backgroundColor: Colors.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.overlay,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 24, color: Colors.textSecondary, marginTop: -2 },
  subTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
});

const setting = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  label: { fontSize: 14, color: Colors.textSecondary },
  value: { fontSize: 13, color: Colors.textMuted },
  chevron: { fontSize: 18, color: Colors.textMuted },
});

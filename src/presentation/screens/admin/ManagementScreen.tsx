// Management Hub Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import TemplateManagementScreen from './TemplateManagementScreen';


type ManagementView = 'list' | 'template' | 'products' | 'team';

export default function ManagementScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<ManagementView>('list');

  const renderBackBtn = () => (
    <TouchableOpacity onPress={() => setView('list')} style={styles.backBtn}>
      <Text style={styles.backIcon}>‹</Text>
    </TouchableOpacity>
  );

  if (view === 'template') {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.subHeader, { paddingTop: insets.top }]}>
          {renderBackBtn()}
          <Text style={styles.subTitle}>Templates</Text>
          <View style={{ width: 40 }} />
        </View>
        <TemplateManagementScreen />
      </View>
    );
  }

  if (view === 'products') {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.subHeader, { paddingTop: insets.top }]}>
          {renderBackBtn()}
          <Text style={styles.subTitle}>Products</Text>
          <View style={{ width: 40 }} />
        </View>
        <PlaceholderScreen title="Product Management" description="Full master data management and pricing controls coming soon." />
      </View>
    );
  }

  if (view === 'team') {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.subHeader, { paddingTop: insets.top }]}>
          {renderBackBtn()}
          <Text style={styles.subTitle}>Team</Text>
          <View style={{ width: 40 }} />
        </View>
        <PlaceholderScreen title="Team Management" description="Manage employees, roles and branch assignments." />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Management</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>Operations</Text>
        <View style={styles.card}>
          <ManagementRow 
            label="Template Management" 
            onPress={() => setView('template')} 
          />
          <View style={styles.divider} />
          <ManagementRow 
            label="Products" 
            onPress={() => setView('products')} 
          />
          <View style={styles.divider} />
          <ManagementRow 
            label="Team" 
            onPress={() => setView('team')} 
          />
        </View>
        
        <Text style={styles.hint}>
          Manage your branches, staff and product catalog for consistent reporting.
        </Text>
      </ScrollView>
    </View>
  );
}

function ManagementRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function PlaceholderScreen({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderIcon}>🛠️</Text>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderDesc}>{description}</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowLabel: { fontSize: 15, color: Colors.textSecondary },
  chevron: { fontSize: 18, color: Colors.textMuted },
  hint: {
    textAlign: 'center', fontSize: 12, lineHeight: 18,
    color: Colors.textMuted, marginTop: Spacing.s8,
    paddingHorizontal: 40,
  },
  // Sub-navigation styles
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
  // Placeholder styles
  placeholder: {
    flex: 1, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40,
  },
  placeholderIcon: { fontSize: 48, marginBottom: 20 },
  placeholderTitle: { fontSize: 18, fontWeight: '500', color: Colors.textPrimary, marginBottom: 8 },
  placeholderDesc: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
});

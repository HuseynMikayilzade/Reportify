// Tab Icon Configuration Screen
// Shown as a sub-screen inside SettingsScreen (internal state navigation)
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import { useAuthStore } from '../../../store/authStore';
import { UserRole } from '../../../domain/entities/UserRole';
import { useNavIconStore, DEFAULT_ICONS, TAB_ICON_OPTIONS } from '../../../store/navIconStore';
import { Button } from '../../components/Button';

const ALL_TABS = ['Reports', 'Dashboard', 'Management', 'Settings'];

// Dynamic Lucide Icon Wrapper
export function RenderIcon({ name, color, size = 16 }: { name: string, color: string, size?: number }) {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <IconComponent color={color} size={size} strokeWidth={2} />;
}

export default function TabIconConfigScreen() {
  const { user } = useAuthStore();
  const { icons, setIcon, resetIcons } = useNavIconStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Respect role rule: Management icon option only visible to Admin / SuperAdmin
  const canAccessManagement =
    user?.role === UserRole.Admin || user?.role === UserRole.SuperAdmin;

  const visibleTabs = ALL_TABS.filter(
    (tab) => tab !== 'Management' || canAccessManagement
  );

  return (
    <View style={styles.root}>
      {/* Search Bar - Fixed at top */}
      <View style={styles.searchContainer}>
        <RenderIcon name="Search" color={Colors.textMuted} size={14} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search icons..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <RenderIcon name="X" color={Colors.textMuted} size={14} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.hint}>
          Tap an icon to apply it to the selected tab. Changes take effect immediately.
        </Text>

      {visibleTabs.map((tab) => {
        const currentIcon = icons[tab] ?? DEFAULT_ICONS[tab];
        
        // Filter options by search query
        const filteredOptions = useMemo(() => {
           const options = TAB_ICON_OPTIONS[tab] ?? [];
           if (!searchQuery.trim()) return options;
           const lowerQuery = searchQuery.toLowerCase();
           return options.filter(opt => 
             opt.label.toLowerCase().includes(lowerQuery) || opt.icon.toLowerCase().includes(lowerQuery)
           );
        }, [tab, searchQuery]);

        if (filteredOptions.length === 0 && searchQuery.trim()) return null;

        return (
          <View key={tab} style={styles.tabBlock}>

            {/* Tab header: current active icon + tab name */}
            <View style={styles.tabHeader}>
              <View style={styles.activeIconBadge}>
                <RenderIcon name={currentIcon} color={Colors.primary} size={16} />
              </View>
              <Text style={styles.tabName}>{tab}</Text>
            </View>

            {/* Icon option grid */}
            <View style={styles.optionRow}>
              {filteredOptions.map(({ icon, label }) => {
                const isActive = currentIcon === icon;
                return (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconOption, isActive && styles.iconOptionActive]}
                    onPress={() => setIcon(tab, icon)}
                    activeOpacity={0.7}
                  >
                     <RenderIcon 
                       name={icon} 
                       color={isActive ? Colors.primary : Colors.textMuted} 
                       size={20} 
                     />
                    <Text style={[styles.iconLabel, isActive && styles.iconLabelActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />
          </View>
        );
      })}

      {/* Reset to default */}
      <Button
        label="Reset to default"
        variant="secondary"
        onPress={resetIcons}
        style={styles.resetBtn}
      />
    </ScrollView>
   </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    padding: Spacing.screenH,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.overlay,
    marginHorizontal: Spacing.screenH,
    marginTop: Spacing.s4,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: Spacing.s6,
  },

  // Tab section
  tabBlock: { marginBottom: Spacing.s2 },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  activeIconBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabName: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },

  // Icon option tiles
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  iconOption: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.overlay,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconOptionActive: {
    backgroundColor: Colors.primaryGhost,
    borderColor: Colors.primary,
  },
  iconLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  iconLabelActive: { color: Colors.primary },

  divider: {
    height: 0.5,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.s4,
  },
  resetBtn: { marginTop: Spacing.s2 },
});

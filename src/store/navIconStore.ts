// Nav Icon Store — persists user-selected bottom tab icons
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default icon set — Lucide icon names
export const DEFAULT_ICONS: Record<string, string> = {
  Reports:    'FileText',
  Dashboard:  'LayoutGrid',
  Management: 'SlidersHorizontal',
  Settings:   'Settings',
};

// Expanded allowed icon options per tab for searching and grouping
export const TAB_ICON_OPTIONS: Record<string, { icon: string; label: string }[]> = {
  Reports: [
    { icon: 'FileText', label: 'Document' },
    { icon: 'ClipboardList', label: 'Clipboard' },
    { icon: 'List', label: 'List' },
    { icon: 'ListTodo', label: 'Task List' },
    { icon: 'FileSpreadsheet', label: 'Spreadsheet' },
    { icon: 'NotebookText', label: 'Notebook' },
    { icon: 'ScrollText', label: 'Scroll' },
    { icon: 'BookOpen', label: 'Book' },
    { icon: 'Files', label: 'Files' },
    { icon: 'FolderOpen', label: 'Folder' },
    { icon: 'AlignLeft', label: 'Align Left' },
  ],
  Dashboard: [
    { icon: 'LayoutGrid', label: 'Grid' },
    { icon: 'LayoutDashboard', label: 'Dashboard' },
    { icon: 'BarChart3', label: 'Bar Chart' },
    { icon: 'PieChart', label: 'Pie Chart' },
    { icon: 'LineChart', label: 'Line Chart' },
    { icon: 'Activity', label: 'Activity' },
    { icon: 'TrendingUp', label: 'Trending Up' },
    { icon: 'GanttChartSquare', label: 'Gantt' },
    { icon: 'KanbanSquare', label: 'Kanban' },
    { icon: 'Trello', label: 'Board' },
    { icon: 'Columns', label: 'Columns' },
  ],
  Management: [
    { icon: 'SlidersHorizontal', label: 'Sliders' },
    { icon: 'Sliders', label: 'Vertical Sliders' },
    { icon: 'Wrench', label: 'Wrench' },
    { icon: 'Tool', label: 'Tool' },
    { icon: 'Settings2', label: 'Controls' },
    { icon: 'Users', label: 'Users' },
    { icon: 'UserCog', label: 'User Admin' },
    { icon: 'Shield', label: 'Security' },
    { icon: 'Briefcase', label: 'Business' },
    { icon: 'Building2', label: 'Building' },
    { icon: 'ClipboardCheck', label: 'Approval' },
  ],
  Settings: [
    { icon: 'Settings', label: 'Gear' },
    { icon: 'User', label: 'User' },
    { icon: 'CircleUser', label: 'User Circle' },
    { icon: 'UserCircle2', label: 'User Outline' },
    { icon: 'BadgeCheck', label: 'Verified' },
    { icon: 'Bell', label: 'Alerts' },
    { icon: 'Key', label: 'Keys' },
    { icon: 'Lock', label: 'Privacy' },
    { icon: 'Cog', label: 'Cog' },
    { icon: 'Nut', label: 'Nut' },
  ],
};

interface NavIconState {
  icons: Record<string, string>;
  setIcon: (tab: string, icon: string) => void;
  resetIcons: () => void;
}

export const useNavIconStore = create<NavIconState>()(
  persist(
    (set) => ({
      icons: { ...DEFAULT_ICONS },
      setIcon: (tab, icon) =>
        set((state) => ({ icons: { ...state.icons, [tab]: icon } })),
      resetIcons: () => set({ icons: { ...DEFAULT_ICONS } }),
    }),
    {
      name: 'reportify-nav-icons',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

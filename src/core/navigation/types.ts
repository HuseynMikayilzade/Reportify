// Navigation Type Definitions
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Reports: undefined;
  Dashboard: undefined;
  Management: undefined;
  Settings: undefined;
};


export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CreateReport: undefined;
  ReportDetail: { reportId: string };
};

export type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavProp = BottomTabNavigationProp<MainTabParamList>;
export type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

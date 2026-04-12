// Network Monitor — watches connectivity and triggers sync
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useSyncStore } from '../../store/syncStore';

class NetworkMonitor {
  private unsubscribe: (() => void) | null = null;
  private wasOffline = false;

  start(): void {
    this.unsubscribe = NetInfo.addEventListener(this.handleStateChange);
  }

  stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  private handleStateChange = (state: NetInfoState): void => {
    const isOnline = state.isConnected && state.isInternetReachable !== false;
    if (isOnline && this.wasOffline) {
      // Back online — trigger sync
      const { sync } = useSyncStore.getState();
      sync().catch(() => {});
    }
    this.wasOffline = !isOnline;
  };

  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return (state.isConnected && state.isInternetReachable !== false) ?? false;
  }
}

export const networkMonitor = new NetworkMonitor();

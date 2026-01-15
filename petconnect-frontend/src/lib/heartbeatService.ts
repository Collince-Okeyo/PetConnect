import { api } from './api';

/**
 * Heartbeat Service
 * Sends periodic heartbeat to server to maintain online status
 */
class HeartbeatService {
  private intervalId: number | null = null;
  private readonly HEARTBEAT_INTERVAL = 2 * 60 * 1000; // 2 minutes
  private isRunning = false;

  /**
   * Start sending heartbeats
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️ Heartbeat service is already running');
      return;
    }

    console.log('💓 Starting heartbeat service...');
    this.isRunning = true;

    // Send initial heartbeat immediately
    this.sendHeartbeat();

    // Then send periodically
    this.intervalId = setInterval(() => {
      this.sendHeartbeat();
    }, this.HEARTBEAT_INTERVAL);
  }

  /**
   * Stop sending heartbeats
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('🛑 Heartbeat service stopped');
    }
  }

  /**
   * Send a single heartbeat to the server
   */
  private async sendHeartbeat() {
    try {
      await api.post('/users/heartbeat');
      console.log('💓 Heartbeat sent');
    } catch (error: any) {
      // Only log if it's not an auth error (user might be logging out)
      if (error.response?.status !== 401) {
        console.error('❌ Heartbeat failed:', error.message);
      }
      
      // If unauthorized, stop the service
      if (error.response?.status === 401) {
        this.stop();
      }
    }
  }

  /**
   * Check if service is running
   */
  isActive() {
    return this.isRunning;
  }
}

// Create singleton instance
const heartbeatService = new HeartbeatService();

export default heartbeatService;

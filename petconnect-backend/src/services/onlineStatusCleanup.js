const User = require('../models/User');

/**
 * Cleanup service to set users offline if they haven't been active
 * Runs periodically to clean up stale online statuses
 */
class OnlineStatusCleanupService {
  constructor() {
    this.cleanupInterval = null;
    this.INACTIVITY_THRESHOLD = 45 * 60 * 1000; // 45 minutes in milliseconds
    this.CLEANUP_INTERVAL = 5 * 60 * 1000; // Run every 5 minutes
  }

  /**
   * Start the cleanup service
   */
  start() {
    console.log('🧹 Starting online status cleanup service...');
    console.log(`   - Inactivity threshold: ${this.INACTIVITY_THRESHOLD / 60000} minutes`);
    console.log(`   - Cleanup interval: ${this.CLEANUP_INTERVAL / 60000} minutes`);

    // Run immediately on start
    this.cleanup();

    // Then run periodically
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Stop the cleanup service
   */
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('🛑 Online status cleanup service stopped');
    }
  }

  /**
   * Perform the cleanup operation
   */
  async cleanup() {
    try {
      const inactiveThreshold = new Date(Date.now() - this.INACTIVITY_THRESHOLD);

      // Find users who are marked as online but haven't been active
      const result = await User.updateMany(
        {
          isOnline: true,
          lastSeen: { $lt: inactiveThreshold }
        },
        {
          $set: { isOnline: false }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`🧹 Cleanup: Set ${result.modifiedCount} inactive user(s) offline`);
      }
    } catch (error) {
      console.error('❌ Error in online status cleanup:', error);
    }
  }

  /**
   * Manually trigger cleanup (for testing)
   */
  async triggerCleanup() {
    console.log('🧹 Manual cleanup triggered');
    await this.cleanup();
  }
}

// Create singleton instance
const cleanupService = new OnlineStatusCleanupService();

module.exports = cleanupService;

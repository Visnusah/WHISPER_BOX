import { User } from '../models/index.js';
import sequelize from '../config/database.js';

async function cleanupDemoAccounts() {
  try {
    console.log('🧹 Cleaning up demo accounts...');
    
    // Remove demo accounts
    const demoEmails = [
      'test@example.com',
      'admin@whisperbox.com',
      'demo@example.com',
      'user@example.com'
    ];
    
    for (const email of demoEmails) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        await user.destroy();
        console.log(`✅ Removed demo account: ${email}`);
      }
    }
    
    console.log('🎉 Demo accounts cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error cleaning up demo accounts:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the script
cleanupDemoAccounts()
  .then(() => {
    console.log('🎉 Cleanup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  });

import sequelize from '../config/database.js';

async function addOTPFields() {
  try {
    console.log('🔧 Adding OTP fields to users table...');
    
    // Add OTP columns if they don't exist
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS otp_code VARCHAR(4),
      ADD COLUMN IF NOT EXISTS otp_expires TIMESTAMP,
      ADD COLUMN IF NOT EXISTS otp_attempts INTEGER DEFAULT 0;
    `);
    
    console.log('✅ OTP fields added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding OTP fields:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the migration
addOTPFields()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });

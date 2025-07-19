import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import sequelize from '../config/database.js';

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'sahk0292@gmail.com' } 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists, updating...');
      
      // Update existing admin
      await existingAdmin.update({
        isAdmin: true,
        isEmailVerified: true,
        isActive: true,
        fullName: 'Admin User',
        username: 'admin'
      });
      
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new admin user
      const adminUser = await User.create({
        email: 'sahk0292@gmail.com',
        password: 'admin123', // Will be hashed automatically
        username: 'admin',
        fullName: 'Admin User',
        isAdmin: true,
        isEmailVerified: true,
        isActive: true
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('Email: sahk0292@gmail.com');
      console.log('Password: admin123');
    }
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('🎉 Admin user setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Admin user setup failed:', error);
    process.exit(1);
  });

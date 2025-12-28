import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    // MongoDB Atlas connection string (fallback if .env not available)
    const defaultMongoURI = 'mongodb+srv://client001:Client001%40Mongo2025@cluster0.jpkxeoj.mongodb.net/foodswipe?appName=Cluster0';
    const mongoURI = process.env.MONGODB_URI || defaultMongoURI;
    
    console.log('🔗 Connecting to MongoDB...');
    console.log('📊 Database:', mongoURI.split('@')[1]?.split('/')[1]?.split('?')[0] || 'foodswipe');
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Please check:');
    console.error('  1. Your internet connection');
    console.error('  2. MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)');
    console.error('  3. Connection string in .env file');
    process.exit(1);
  }
};

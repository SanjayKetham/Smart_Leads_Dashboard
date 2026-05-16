import mongoose from 'mongoose';
import User from '../models/User';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://kethamsanjay_db_user:7P74kEOoehH2QEEZ@cluster0.zsnacng.mongodb.net/?appName=Cluster0');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Seed Default Admin User
        const adminExists = await User.findOne({ email: 'admin@smartleads.com' });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: 'admin@smartleads.com',
                password: 'adminpassword123',
                role: 'Admin',
            });
            console.log('Default Admin User Created -> Email: admin@smartleads.com | Password: adminpassword123');
        }
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

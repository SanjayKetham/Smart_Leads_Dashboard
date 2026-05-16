import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db';
import User from './src/models/User';
import Lead from './src/models/Lead';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-leads');
        
        // Ensure Admin exists
        let admin = await User.findOne({ email: 'admin@smartleads.com' });
        if (!admin) {
            admin = await User.create({
                name: 'System Admin',
                email: 'admin@smartleads.com',
                password: 'adminpassword123',
                role: 'Admin',
            });
        }

        // Ensure Sales User exists
        let salesUser = await User.findOne({ email: 'sales@smartleads.com' });
        if (!salesUser) {
            salesUser = await User.create({
                name: 'Jane Sales',
                email: 'sales@smartleads.com',
                password: 'salespassword123',
                role: 'Sales User',
            });
        }

        // Clear existing leads (optional, but good for clean slate)
        // await Lead.deleteMany({});

        // Add 3 leads for Admin
        await Lead.insertMany([
            { name: 'Admin Lead 1', email: 'adminlead1@example.com', status: 'New', source: 'Website', createdBy: admin._id },
            { name: 'Admin Lead 2', email: 'adminlead2@example.com', status: 'Qualified', source: 'Instagram', createdBy: admin._id },
            { name: 'Admin Lead 3', email: 'adminlead3@example.com', status: 'Lost', source: 'Referral', createdBy: admin._id }
        ]);

        // Add 3 leads for Sales User
        await Lead.insertMany([
            { name: 'Sales Lead 1', email: 'saleslead1@example.com', status: 'Contacted', source: 'Website', createdBy: salesUser._id },
            { name: 'Sales Lead 2', email: 'saleslead2@example.com', status: 'Qualified', source: 'Referral', createdBy: salesUser._id },
            { name: 'Sales Lead 3', email: 'saleslead3@example.com', status: 'New', source: 'Instagram', createdBy: salesUser._id }
        ]);

        console.log('Dummy Leads added successfully!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();

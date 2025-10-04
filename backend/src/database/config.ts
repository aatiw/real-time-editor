import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(uri!);
        console.log('connection with mongo established')
    } catch (error) {
        console.error('error in mongo connection', error);
        process.exit(1)
    }
}

export default connectDb;
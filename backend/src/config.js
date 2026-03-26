import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management';
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
export const PORT = process.env.PORT || 5000;

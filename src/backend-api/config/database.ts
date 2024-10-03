import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authConfig } from '../config/auth';

// Load environment variables from .env file
dotenv.config();

// Define global variables
const DATABASE_URL: string = process.env.DATABASE_URL || 'mongodb://localhost:27017/excel_backend';
const DATABASE_OPTIONS: mongoose.ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    ...authConfig.getDatabaseAuthOptions(), // Assuming authConfig provides database authentication options
};

/**
 * Establishes a connection to the MongoDB database using the provided configuration.
 */
export async function connectToDatabase(): Promise<void> {
    try {
        await mongoose.connect(DATABASE_URL, DATABASE_OPTIONS);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

/**
 * Closes the connection to the MongoDB database.
 */
export async function disconnectFromDatabase(): Promise<void> {
    try {
        await mongoose.disconnect();
        console.log('Successfully disconnected from the database');
    } catch (error) {
        console.error('Error disconnecting from the database:', error);
    }
}

// Export the mongoose instance for use in other parts of the application
export { mongoose };
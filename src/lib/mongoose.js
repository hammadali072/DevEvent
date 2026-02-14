import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Global cache object (for Next.js hot reload)
let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

/**
 * Connect to MongoDB and cache the connection
 */
async function connectDB() {
    // If already connected, return it
    if (cached.conn) {
        return cached.conn;
    }

    // If no connection promise, create one
    if (!cached.promise) {
        if (!MONGODB_URI) {
            throw new Error(
                "Please define the MONGODB_URI environment variable inside .env.local"
            );
        }

        const options = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectDB;

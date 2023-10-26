import mongoose from "mongoose";
import { config } from "dotenv";

config();

const db = (process.env.NODE_ENV == 'dev') ? String(process.env.LOCAL_DB) : String(process.env.ONLINE_DB);

export default async function database_connection() {
    try {
        const conn = await mongoose.connect(db);
        if (conn) {
            console.log(`Database connected @ ${db}`);
        }else {
            console.log(`Database connection failed`);
        }
    } catch (error) {
        console.log(`Database connection failed: ${error}`);
    }
};
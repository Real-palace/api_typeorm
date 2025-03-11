import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './_helpers/db';
import userRoutes from './users/users.controller'; // ✅ Import user routes

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
userRoutes(app); // ✅ Directly pass 'app' to handle routes

// Start server
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, async () => {
    await initializeDatabase();
    console.log(`🚀 Server listening on port ${port}`);
});

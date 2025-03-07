import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import userRoutes from './users/users.controller';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
app.use('/users', userRoutes);

// Global error handler (must be the last middleware)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

// Start server
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));

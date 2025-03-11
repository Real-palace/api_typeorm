import { Request, Response } from 'express';
import { userService } from './user.service';

export default function userRoutes(app: any) {
    // GET - Retrieve all users
    app.get('/users', async (req: Request, res: Response) => {
        try {
            const users = await userService.getAll();
            res.json(users);
        } catch (err: unknown) {
            const error = err as Error; // ✅ Cast 'err' as Error
            res.status(500).json({ message: error.message });
        }
    });

    // POST - Create a new user
    app.post('/users', async (req: Request, res: Response) => {
        try {
            await userService.create(req.body);
            res.json({ message: 'User created successfully' });
        } catch (err: unknown) {
            const error = err as Error; // ✅ Cast 'err' as Error
            res.status(500).json({ message: error.message });
        }
    });
}

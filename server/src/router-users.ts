import { NextFunction, Request, Response, Router } from 'express';
import fsPromises from 'fs/promises';

const usersRouter = Router();

// Get all users
usersRouter.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const content = await fsPromises.readFile('./db/users.json', 'utf-8');

        const users = JSON.parse(content);
        
        if (content) {
            res.json(users);
        } else {

            res.json('The file not found');
        }
    } catch (error) {
        console.error('Users file not found', error);
    }
})

// Get user by id
usersRouter.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id);

    try {
        const content = await fsPromises.readFile('./db/users.json', 'utf-8');

        const users = JSON.parse(content);

        const user = users.find((user: { id: number }) => user.id === userId);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error reading users.json:', error);

        res.status(500).json({ message: 'Internal server error' });
    }
});
export default usersRouter;

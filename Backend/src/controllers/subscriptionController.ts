import { Request, Response } from 'express';
import { addSubscription, removeSubscription } from '../services/userService';

export const addSubscriptionController = async (req: Request, res: Response) => {
    const { userId, musicId } = req.body;
    try {
        await addSubscription(userId, musicId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

export const removeSubscriptionController = async (req: Request, res: Response) => {
    const { userId, musicId } = req.body;
    try {
        await removeSubscription(userId, musicId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};
import { Request, Response } from 'express';
import { getMusic, createMusic } from '../services/musicService';

export const getMusicController = async (req: Request, res: Response) => {
  try {
    const music = await getMusic(req.params.id);
    res.json(music);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const createMusicController = async (req: Request, res: Response) => {
  try {
    const music = await createMusic(req.body);
    res.status(201).json(music);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
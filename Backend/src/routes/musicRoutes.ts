import { Router } from 'express';
import { getMusicController, createMusicController } from '../controllers/musicController';

const router = Router();

router.get('/:id', getMusicController);
router.post('/', createMusicController);

export default router;
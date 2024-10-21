import { Router } from 'express';
import { getMusicController, createMusicController, queryMusicController } from '../controllers/musicController';

const router = Router();

router.get('/:id', getMusicController);
router.post('/', createMusicController);
router.post('/query', queryMusicController);

export default router;
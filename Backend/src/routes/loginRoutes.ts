import { Router } from 'express';
import { getUserController, createUserController } from '../controllers/loginController';

const router = Router();

router.get('/:id', getUserController);
router.post('/', createUserController);

export default router;
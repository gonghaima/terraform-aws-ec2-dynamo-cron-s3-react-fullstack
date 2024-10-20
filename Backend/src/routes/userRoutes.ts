import { Router } from 'express';
import { getUserController, createUserController, loginUserController } from '../controllers/userController';

const router = Router();

router.get('/:id', getUserController);
router.post('/login', loginUserController);
router.post('/register', createUserController);

export default router;
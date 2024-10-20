import { Router } from 'express';
import { getUserController, createUserController, loginUserController } from '../controllers/loginController';

const router = Router();

router.get('/:id', getUserController);
router.post('/', createUserController);
router.post('/login', loginUserController);

export default router;
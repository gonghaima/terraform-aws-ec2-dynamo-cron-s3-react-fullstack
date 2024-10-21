import { Router } from 'express';
import { addSubscriptionController, removeSubscriptionController } from '../controllers/subscriptionController';

const router = Router();

router.post('/add', addSubscriptionController);
router.post('/remove', removeSubscriptionController);

export default router;
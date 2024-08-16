import { Router } from 'express';
import { getNotifications, markNotificationsAsRead, createNotification, deleteNotification } from '../../controllers/notificationsController.js';
import Auth from '../../middleware/auth.js';

const router = Router();

router.post('/notify', Auth, createNotification);
router.get('/', Auth, getNotifications);
router.put('/mark-read', Auth, markNotificationsAsRead);
router.delete('/:id', Auth, deleteNotification);

export default router;

import express from 'express';
import { createUrl, getUrls, deleteUrl, getUrlAnalytics } from '../controllers/urlController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Apply auth protection middleware to all URL routes
router.use(protect);

router.post('/', createUrl);
router.get('/', getUrls);
router.delete('/:id', deleteUrl);
router.get('/:id/analytics', getUrlAnalytics);

export default router;

import { Router } from 'express';
import { searchArticles } from '../controllers/searchController.js';

const router = Router();

router.get('/', searchArticles);

export default router;

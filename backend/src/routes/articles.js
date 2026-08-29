import { Router } from 'express';
import { listArticles, getArticle } from '../controllers/articlesController.js';

const router = Router();

router.get('/', listArticles);
router.get('/:id', getArticle);

export default router;

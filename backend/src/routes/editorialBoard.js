import { Router } from 'express';
import { listEditorialBoard } from '../controllers/editorialBoardController.js';

const router = Router();

router.get('/', listEditorialBoard);

export default router;

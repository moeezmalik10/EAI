import { Router } from 'express';
import { listIssues, getIssue } from '../controllers/issuesController.js';

const router = Router();

router.get('/', listIssues);
router.get('/:id', getIssue);

export default router;

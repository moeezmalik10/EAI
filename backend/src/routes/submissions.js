import { Router } from 'express';
import { createSubmission } from '../controllers/submissionsController.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', upload.single('manuscriptFile'), createSubmission);

export default router;

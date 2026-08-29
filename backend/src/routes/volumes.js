import { Router } from 'express';
import { listVolumes } from '../controllers/volumesController.js';

const router = Router();

router.get('/', listVolumes);

export default router;

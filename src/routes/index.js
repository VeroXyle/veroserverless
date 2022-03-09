import express from 'express';
import images from './images.js';

const router = express.Router();

router.use('/images', images);

export default router;

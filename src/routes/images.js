import express from 'express';
import { uploadImage } from '../functions/images.js';

const router = express.Router();

router.use('/upload', uploadImage);

export default router;

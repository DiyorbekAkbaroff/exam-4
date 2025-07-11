import express from 'express';
import { addBookmark, getBookmarks } from '../controller/bookmark.controller.js';

const router = express.Router();

router.post('/', addBookmark);
router.get('/:userId', getBookmarks);

export default router;
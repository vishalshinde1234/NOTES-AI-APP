const express = require('express');
const router = express.Router();
const { generateNote, summarizeNote, improveNote, makeBullets } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');


router.post('/generate', generateNote);
router.post('/summarize', summarizeNote);
router.post('/improve', improveNote);
router.post('/bullets', makeBullets);

module.exports = router;
const { Router } = require('express');
const postController = require('../controllers/postController');

const router = Router();

router.get('/', postController.listPublished);
router.get('/:slug', postController.getBySlug);

module.exports = router;

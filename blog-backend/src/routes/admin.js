const { Router } = require('express');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const authenticate = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = Router();

// Auth
router.post('/login', loginLimiter, authController.login);

// Posts (protected)
router.get('/posts', authenticate, postController.listAll);
router.get('/posts/:id', authenticate, postController.getById);
router.post('/posts', authenticate, postController.create);
router.put('/posts/:id', authenticate, postController.update);
router.post('/posts/:id/publish', authenticate, postController.publish);

module.exports = router;

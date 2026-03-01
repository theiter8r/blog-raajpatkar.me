const { Router } = require('express');
const subscriberController = require('../controllers/subscriberController');
const { subscribeLimiter } = require('../middleware/rateLimiter');

const router = Router();

router.post('/subscribe', subscribeLimiter, subscriberController.subscribe);
router.get('/confirm/:token', subscriberController.confirm);
router.post('/unsubscribe/:token', subscriberController.unsubscribe);

module.exports = router;

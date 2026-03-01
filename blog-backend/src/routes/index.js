const { Router } = require('express');
const adminRoutes = require('./admin');
const postRoutes = require('./posts');
const subscriberRoutes = require('./subscribers');

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/admin', adminRoutes);
router.use('/posts', postRoutes);
router.use('/', subscriberRoutes);

module.exports = router;

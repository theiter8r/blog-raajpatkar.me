const postService = require('../services/postService');
const { addNewsletterJob } = require('../queue/newsletterQueue');

const postController = {
  /**
   * Create a new draft post (admin)
   */
  async create(req, res, next) {
    try {
      const { title, content, excerpt, status } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const post = await postService.create({
        title,
        content,
        excerpt,
        authorId: req.admin.id,
        status: status || 'draft',
      });

      // If the post was created as published, trigger the newsletter
      if (post.status === 'published') {
        await addNewsletterJob(post);
      }

      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update a post (admin)
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, excerpt } = req.body;

      const post = await postService.update(id, { title, content, excerpt });
      res.json(post);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Publish a post and trigger newsletter (admin)
   */
  async publish(req, res, next) {
    try {
      const { id } = req.params;

      const post = await postService.publish(id);

      // Add newsletter job to queue
      await addNewsletterJob(post);

      res.json({
        message: 'Post published. Newsletter emails are being queued.',
        post,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get a single post by ID (admin)
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.getById(id);
      res.json(post);
    } catch (err) {
      next(err);
    }
  },

  /**
   * List all posts (admin)
   */
  async listAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

      const result = await postService.listAll({ page, limit });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * List published posts (public)
   */
  async listPublished(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

      const result = await postService.listPublished({ page, limit });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get post by slug (public)
   */
  async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const post = await postService.getBySlug(slug);
      res.json(post);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = postController;

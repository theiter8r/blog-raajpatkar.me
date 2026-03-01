const db = require('../config/database');
const { renderMarkdown, slugify } = require('./markdown');
const { AppError } = require('../middleware/errorHandler');

const postService = {
  /**
   * Create a new draft post
   */
  async create({ title, content, excerpt, authorId, status = 'draft' }) {
    const slug = slugify(title);
    const htmlContent = renderMarkdown(content);

    // Check for duplicate slug
    const existing = await db.query('SELECT id FROM posts WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      throw new AppError('A post with a similar title already exists', 409);
    }

    const shouldPublish = status === 'published';

    const result = await db.query(
      `INSERT INTO posts (title, slug, content, html_content, excerpt, author_id, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, ${shouldPublish ? 'NOW()' : 'NULL'})
       RETURNING *`,
      [title, slug, content, htmlContent, excerpt, authorId, shouldPublish ? 'published' : 'draft']
    );

    return result.rows[0];
  },

  /**
   * Update an existing post
   */
  async update(id, { title, content, excerpt }) {
    const post = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (post.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }

    const updates = {};
    if (title) {
      updates.title = title;
      updates.slug = slugify(title);

      // Check slug uniqueness (excluding current post)
      const existing = await db.query(
        'SELECT id FROM posts WHERE slug = $1 AND id != $2',
        [updates.slug, id]
      );
      if (existing.rows.length > 0) {
        throw new AppError('A post with a similar title already exists', 409);
      }
    }
    if (content) {
      updates.content = content;
      updates.html_content = renderMarkdown(content);
    }
    if (excerpt !== undefined) {
      updates.excerpt = excerpt;
    }

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(id);
    const result = await db.query(
      `UPDATE posts SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  /**
   * Publish a post
   */
  async publish(id) {
    const post = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (post.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }

    if (post.rows[0].status === 'published') {
      throw new AppError('Post is already published', 400);
    }

    const result = await db.query(
      `UPDATE posts SET status = 'published', published_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    return result.rows[0];
  },

  /**
   * Get all published posts (public)
   */
  async listPublished({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const countResult = await db.query(
      "SELECT COUNT(*) FROM posts WHERE status = 'published'"
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await db.query(
      `SELECT id, title, slug, excerpt, published_at, created_at
       FROM posts
       WHERE status = 'published'
       ORDER BY published_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return {
      posts: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get all posts for admin (drafts + published)
   */
  async listAll({ page = 1, limit = 50 }) {
    const offset = (page - 1) * limit;

    const countResult = await db.query('SELECT COUNT(*) FROM posts');
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await db.query(
      `SELECT id, title, slug, excerpt, status, published_at, created_at
       FROM posts
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return {
      posts: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get a single published post by slug (public)
   */
  async getBySlug(slug) {
    const result = await db.query(
      `SELECT id, title, slug, excerpt, content, html_content, published_at, created_at
       FROM posts
       WHERE slug = $1 AND status = 'published'`,
      [slug]
    );

    if (result.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }

    return result.rows[0];
  },

  /**
   * Get post by ID (admin)
   */
  async getById(id) {
    const result = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }
    return result.rows[0];
  },
};

module.exports = postService;

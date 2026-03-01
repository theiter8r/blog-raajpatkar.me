const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const env = require('../config/env');
const { AppError } = require('../middleware/errorHandler');

const authService = {
  /**
   * Authenticate admin and return JWT
   */
  async login(email, password) {
    const result = await db.query(
      'SELECT id, email, name, password_hash FROM admins WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const admin = result.rows[0];
    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  },
};

module.exports = authService;

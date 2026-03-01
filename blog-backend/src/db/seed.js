const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function seed() {
  console.log('Seeding admin user...');

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const name = process.env.ADMIN_NAME || 'Admin';

  const hash = await bcrypt.hash(password, 12);

  try {
    await db.query(
      `INSERT INTO admins (email, password_hash, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [email, hash, name]
    );
    console.log(`Admin user seeded: ${email}`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

seed();

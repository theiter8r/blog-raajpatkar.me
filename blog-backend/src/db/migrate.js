const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function migrate() {
  console.log('Running database migration...');

  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');

  try {
    await db.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

migrate();

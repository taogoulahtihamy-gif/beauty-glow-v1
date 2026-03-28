import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

dotenv.config();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_NAME || 'Beauty Glow Admin';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD sont requis dans backend/.env');
  }

  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (exists.rowCount > 0) {
    console.log('Admin déjà présent.');
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (role, full_name, email, phone, password_hash)
     VALUES ('admin', $1, $2, '', $3)`,
    [fullName, email, hash]
  );

  console.log('Admin créé avec succès.');
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

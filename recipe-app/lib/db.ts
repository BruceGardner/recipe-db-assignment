import { sql } from '@vercel/postgres';

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const result = await sql.query(text, params ?? []);
  return result.rows as T[];
}

export async function initDB() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      password    TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name        TEXT NOT NULL,
      image_url   TEXT NOT NULL DEFAULT '',
      ingredients JSONB NOT NULL DEFAULT '[]',
      steps       JSONB NOT NULL DEFAULT '[]',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

export type DBUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
};

export async function getUserByEmail(email: string): Promise<DBUser | null> {
  const rows = await query<DBUser>(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0] ?? null;
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string
): Promise<DBUser> {
  const rows = await query<DBUser>(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  );
  return rows[0];
}

export type DBRecipe = {
  id: number;
  user_id: number;
  name: string;
  image_url: string;
  ingredients: string[];
  steps: string[];
  created_at: string;
};

export async function getRecipesByUser(userId: number): Promise<DBRecipe[]> {
  return query<DBRecipe>(
    'SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
}

export async function getRecipeById(
  id: number,
  userId: number
): Promise<DBRecipe | null> {
  const rows = await query<DBRecipe>(
    'SELECT * FROM recipes WHERE id = $1 AND user_id = $2 LIMIT 1',
    [id, userId]
  );
  return rows[0] ?? null;
}

export async function createRecipe(
  userId: number,
  name: string,
  imageUrl: string,
  ingredients: string[],
  steps: string[]
): Promise<DBRecipe> {
  const rows = await query<DBRecipe>(
    `INSERT INTO recipes (user_id, name, image_url, ingredients, steps)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, name, imageUrl, JSON.stringify(ingredients), JSON.stringify(steps)]
  );
  return rows[0];
}

export async function updateRecipe(
  id: number,
  userId: number,
  name: string,
  imageUrl: string,
  ingredients: string[],
  steps: string[]
): Promise<DBRecipe | null> {
  const rows = await query<DBRecipe>(
    `UPDATE recipes
     SET name = $1, image_url = $2, ingredients = $3, steps = $4
     WHERE id = $5 AND user_id = $6
     RETURNING *`,
    [name, imageUrl, JSON.stringify(ingredients), JSON.stringify(steps), id, userId]
  );
  return rows[0] ?? null;
}

export async function deleteRecipe(
  id: number,
  userId: number
): Promise<boolean> {
  const rows = await query(
    'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return rows.length > 0;
}
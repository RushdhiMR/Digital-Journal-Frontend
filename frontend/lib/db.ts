import mysql from 'mysql2/promise';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password?: string | null;
  password_hash?: string | null;
  provider: string;
  google_id?: string | null;
  role: 'reader' | 'writer' | 'admin';
  email_verified: boolean | number;
  reset_token?: string | null;
  reset_token_expires?: string | Date | null;
  created_at?: string | Date;
  updated_at?: string | Date;
}

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'digital_journal_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export const DB = {
  async getUserByEmail(email: string): Promise<UserRow | null> {
    try {
      const db = getDbPool();
      const norm = (email || '').trim().toLowerCase();
      const [rows]: any = await db.query(
        'SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
        [norm]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as UserRow;
      }
    } catch (e) {
      console.error('[DB.getUserByEmail] Error:', e);
    }
    return null;
  },

  async getUserById(id: number): Promise<UserRow | null> {
    try {
      const db = getDbPool();
      const [rows]: any = await db.query(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0] as UserRow;
      }
    } catch (e) {
      console.error('[DB.getUserById] Error:', e);
    }
    return null;
  },

  async getAllUsers(): Promise<UserRow[]> {
    try {
      const db = getDbPool();
      const [rows]: any = await db.query(
        'SELECT id, name, email, role, provider, email_verified, created_at, updated_at FROM users ORDER BY id ASC'
      );
      if (Array.isArray(rows)) {
        return rows as UserRow[];
      }
    } catch (e) {
      console.error('[DB.getAllUsers] Error:', e);
    }
    return [];
  },

  async createUser(userData: {
    name: string;
    email: string;
    password_hash?: string | null;
    role?: 'reader' | 'writer' | 'admin';
    provider?: string;
    google_id?: string | null;
    email_verified?: boolean | number;
  }): Promise<UserRow> {
    const db = getDbPool();
    const norm = (userData.email || '').trim().toLowerCase();
    const role = userData.role || 'reader';
    const provider = userData.provider || 'local';
    const verified = userData.email_verified ? 1 : 0;

    const [result]: any = await db.query(
      `INSERT INTO users (name, email, password_hash, role, provider, google_id, email_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.name.trim(),
        norm,
        userData.password_hash || null,
        role,
        provider,
        userData.google_id || null,
        verified,
      ]
    );

    const newId = result.insertId;
    return {
      id: newId,
      name: userData.name.trim(),
      email: norm,
      password_hash: userData.password_hash || null,
      role: role as any,
      provider,
      google_id: userData.google_id || null,
      email_verified: verified,
    };
  },

  async updateUser(id: number, updates: Partial<UserRow>): Promise<UserRow | null> {
    try {
      const db = getDbPool();
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.name !== undefined) {
        fields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.email !== undefined) {
        fields.push('email = ?');
        values.push(updates.email.trim().toLowerCase());
      }
      if (updates.password_hash !== undefined) {
        fields.push('password_hash = ?');
        values.push(updates.password_hash);
      }
      if (updates.role !== undefined) {
        fields.push('role = ?');
        values.push(updates.role);
      }
      if (updates.provider !== undefined) {
        fields.push('provider = ?');
        values.push(updates.provider);
      }
      if (updates.email_verified !== undefined) {
        fields.push('email_verified = ?');
        values.push(updates.email_verified ? 1 : 0);
      }
      if (updates.reset_token !== undefined) {
        fields.push('reset_token = ?');
        values.push(updates.reset_token);
      }
      if (updates.reset_token_expires !== undefined) {
        fields.push('reset_token_expires = ?');
        values.push(updates.reset_token_expires);
      }

      if (fields.length > 0) {
        values.push(id);
        await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
      }

      return await this.getUserById(id);
    } catch (e) {
      console.error('[DB.updateUser] Error:', e);
      return null;
    }
  },

  async deleteUser(id: number): Promise<boolean> {
    try {
      const db = getDbPool();
      const [result]: any = await db.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (e) {
      console.error('[DB.deleteUser] Error:', e);
      return false;
    }
  },
};

export default getDbPool;

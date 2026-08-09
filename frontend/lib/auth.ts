import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'dj_super_secret_jwt_key_2026_production';
export const AUTH_COOKIE_NAME = 'dj_session';

export interface JWTPayload {
  id: number;
  email: string;
  name: string;
  role: string;
  provider: string;
}

/**
 * Normalizes email: trims whitespace and converts to lowercase
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Hashes password using bcrypt with salt round 10
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plaintext password with stored bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Generates JWT session token
 */
export function signAuthToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies JWT session token
 */
export function verifyAuthToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Sets secure HTTP-Only session cookie in Next.js response headers
 */
export async function setAuthCookie(payload: JWTPayload) {
  const token = signAuthToken(payload);
  const cookieStore = await cookies();
  
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
  
  return token;
}

/**
 * Clears HTTP-Only session cookie
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Retrieves & verifies current session user from HTTP-Only cookie
 */
export async function getAuthSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAuthToken(token);
  } catch (err) {
    return null;
  }
}

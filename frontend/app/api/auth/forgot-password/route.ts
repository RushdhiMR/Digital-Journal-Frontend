import { NextResponse } from 'next/server';
import { normalizeEmail } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    const normalized = normalizeEmail(email);

    try {
      const token = crypto.randomBytes(32).toString('hex');
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const origin = process.env.FRONTEND_URL || `${protocol}://${host}`;
      const resetUrl = `${origin}/reset-password?token=${token}`;

      await sendPasswordResetEmail(normalized, resetUrl);
    } catch (e) {
      console.warn('Password reset email trigger skipped:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, password reset instructions have been sent.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';
import { normalizeEmail, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalized = normalizeEmail(email);

    if (!emailRegex.test(normalized)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const userName = name.trim();
    const userRole = normalized.includes('admin') ? 'admin' : normalized.includes('writer') ? 'writer' : 'user';

    const userPayload = {
      id: Date.now(),
      name: userName,
      email: normalized,
      role: userRole,
      provider: 'local',
    };

    // Set HTTP-Only session cookie
    await setAuthCookie(userPayload);

    // Send welcome email if configured
    try {
      await sendWelcomeEmail(normalized, userName);
    } catch (e) {
      console.warn('Welcome email notification skipped:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: userPayload,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


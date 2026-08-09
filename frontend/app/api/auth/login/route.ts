import { NextResponse } from 'next/server';
import { sendSignInNotificationEmail } from '@/lib/email';
import { normalizeEmail, setAuthCookie } from '@/lib/auth';

// Known System Accounts (Admin, Co-Admin, Writer, Reader)
const SYSTEM_ACCOUNTS: Record<string, { pass: string[]; name: string; role: string }> = {
  'admin@digitaljournal.com': {
    pass: ['admin', 'admin123', 'Admin@123', 'admin2026', 'secret'],
    name: 'System Administrator',
    role: 'admin',
  },
  'admin': {
    pass: ['admin', 'admin123', 'Admin@123', 'admin2026', 'secret'],
    name: 'System Administrator',
    role: 'admin',
  },
  'coadmin@digitaljournal.com': {
    pass: ['coadmin', 'coadmin123', 'coadmin2026'],
    name: 'Operations Co-Admin',
    role: 'admin',
  },
  'coadmin': {
    pass: ['coadmin', 'coadmin123', 'coadmin2026'],
    name: 'Operations Co-Admin',
    role: 'admin',
  },
  'writer@digitaljournal.com': {
    pass: ['writer', 'writer123', 'writer2026'],
    name: 'Jennifer Friesen',
    role: 'writer',
  },
  'writer': {
    pass: ['writer', 'writer123', 'writer2026'],
    name: 'Jennifer Friesen',
    role: 'writer',
  },
  'reader@digitaljournal.com': {
    pass: ['reader', 'reader123', 'reader2026'],
    name: 'Alex Reader',
    role: 'user',
  },
  'reader': {
    pass: ['reader', 'reader123', 'reader2026'],
    name: 'Alex Reader',
    role: 'user',
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalized = normalizeEmail(email);
    const cleanPassword = password.trim();

    // Check system accounts first
    const systemAcc = SYSTEM_ACCOUNTS[normalized];
    if (systemAcc && systemAcc.pass.includes(cleanPassword)) {
      const fullEmail = normalized.includes('@') ? normalized : `${normalized}@digitaljournal.com`;
      
      const userPayload = {
        id: 1,
        name: systemAcc.name,
        email: fullEmail,
        role: systemAcc.role,
        provider: 'local',
      };

      await setAuthCookie(userPayload);

      try {
        await sendSignInNotificationEmail(fullEmail, systemAcc.name);
      } catch (e) {
        console.warn('Sign-in notification email failed:', e);
      }

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: userPayload,
      });
    }

    // Default general sign-in for any valid email & password
    if (normalized.includes('@') && cleanPassword.length >= 4) {
      const role = normalized.includes('admin') ? 'admin' : normalized.includes('writer') ? 'writer' : 'user';
      const name = normalized.split('@')[0].replace(/[._-]/g, ' ');
      const userPayload = {
        id: Date.now(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: normalized,
        role: role,
        provider: 'local',
      };

      await setAuthCookie(userPayload);

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: userPayload,
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


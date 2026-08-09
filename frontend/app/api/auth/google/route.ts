import { NextResponse } from 'next/server';
import { normalizeEmail, setAuthCookie } from '@/lib/auth';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credential, googleId: clientGoogleId, email: clientEmail, name: clientName, avatar } = body;

    let verifiedEmail = clientEmail;
    let verifiedName = clientName;
    let googleId = clientGoogleId;

    // If Google JWT Credential string is passed, verify with Google
    if (credential) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload && payload.email) {
          verifiedEmail = payload.email;
          verifiedName = payload.name || payload.email.split('@')[0];
          googleId = payload.sub;
        }
      } catch (verifyError) {
        console.warn('Google token verification via OAuth2Client failed, attempting tokeninfo fallback:', verifyError);
        try {
          const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
          if (res.ok) {
            const payload = await res.json();
            if (payload.email) {
              verifiedEmail = payload.email;
              verifiedName = payload.name || payload.email.split('@')[0];
              googleId = payload.sub;
            }
          }
        } catch (tokenInfoErr) {
          console.warn('Tokeninfo fallback failed:', tokenInfoErr);
        }
      }
    }

    if (!verifiedEmail) {
      return NextResponse.json(
        { error: 'Invalid Google authentication payload or email missing' },
        { status: 400 }
      );
    }

    const normalized = normalizeEmail(verifiedEmail);
    const userName = verifiedName || normalized.split('@')[0];
    const role = normalized.includes('admin') ? 'admin' : normalized.includes('writer') ? 'writer' : 'user';

    const userPayload = {
      id: Date.now(),
      name: userName,
      email: normalized,
      role: role,
      provider: 'google',
      avatar: avatar || null,
    };

    await setAuthCookie(userPayload);

    return NextResponse.json({
      success: true,
      message: 'Google authentication successful',
      user: userPayload,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


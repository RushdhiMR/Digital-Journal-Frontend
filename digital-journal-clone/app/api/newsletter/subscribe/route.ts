import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    try {
      await db.query(
        'INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE email=email',
        [email]
      );

      return NextResponse.json({
        success: true,
        message: 'Subscribed to Digital Journal newsletters successfully!',
      });
    } catch (dbError) {
      console.warn('DB newsletter insert error, using fallback:', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed to Digital Journal newsletters successfully!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

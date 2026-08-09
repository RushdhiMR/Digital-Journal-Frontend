import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: session,
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, user: null, error: error.message },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Execute a simple query to verify database connection
    const [rows] = await db.query('SELECT NOW() AS currentTime');
    return NextResponse.json({
      status: 'connected',
      message: 'Database connection successful!',
      data: rows,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to database',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      stats: {
        totalArticles: 12,
        totalAuthors: 5,
        totalSubscribers: 148,
        totalUsers: 34,
        monthlyViews: "128,450",
        systemStatus: "Healthy / Operational",
        lastBackup: "2026-07-25 04:00 AM UTC"
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Simple query to prove DB connectivity
    const count = await prisma.ping.count();

    return NextResponse.json({
      ok: true,
      db: 'up',
      pingCount: count,
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        ok: false,
        db: 'down',
        error: 'Database connection failed',
      },
      { status: 500 }
    );
  }
}

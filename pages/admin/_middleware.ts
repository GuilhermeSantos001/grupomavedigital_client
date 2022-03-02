import { NextRequest, NextResponse } from 'next/server'
import { SessionMiddleware } from 'middlewares/SessionMiddleware';

export function middleware(req: NextRequest) {
  return SessionMiddleware(req, NextResponse.next());
}
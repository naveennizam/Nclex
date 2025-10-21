import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('refresh_token')?.value;

    const protectedPaths = ['/dashboard', '/admin', '/profile'];
    const pathname = request.nextUrl.pathname;

    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtected && !token) return NextResponse.redirect(new URL('/', request.url));

    return NextResponse.next();
}



export const config = {
    matcher: ['/profile/:path*', '/dashboard/:path*', '/admin/:path*'],

}
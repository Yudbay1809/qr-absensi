import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const sessionCookieName = "gwen_session";

const publicPaths = new Set([
  "/",
  "/login",
  "/api/auth/login",
]);

async function verifyToken(token: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  try {
    const result = await jwtVerify(token, new TextEncoder().encode(secret));
    return result.payload as {
      sub: string;
      role: "ADMIN" | "EMPLOYEE";
    };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicPaths.has(pathname)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(sessionCookieName)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/generate-qr")) {
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

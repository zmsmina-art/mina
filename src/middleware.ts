import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const AUTH_REALM = "Admin";

/** Constant-time string comparison to prevent timing attacks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${AUTH_REALM}", charset="UTF-8"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

function invalidConfiguration() {
  return new NextResponse("Private route is not configured.", {
    status: 503,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  const expectedUsername = process.env.ADMIN_USERNAME ?? "mina";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return invalidConfiguration();
  }

  const authorization = request.headers.get("authorization");
  if (!authorization || !authorization.startsWith("Basic ")) {
    return unauthorized();
  }

  const encodedCredentials = authorization.slice(6).trim();
  let decodedCredentials = "";

  try {
    decodedCredentials = atob(encodedCredentials);
  } catch {
    return unauthorized();
  }

  const separator = decodedCredentials.indexOf(":");
  const username = separator === -1 ? decodedCredentials : decodedCredentials.slice(0, separator);
  const password = separator === -1 ? "" : decodedCredentials.slice(separator + 1);

  if (!safeEqual(username, expectedUsername) || !safeEqual(password, expectedPassword)) {
    return unauthorized();
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

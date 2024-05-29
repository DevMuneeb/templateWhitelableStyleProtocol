import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/mvp/dashboard",
  "/mvp/confirmation",
  "/mvp/order-history",
  "/style-gpt/dashboard",
  "/style-gpt/order-history",
  "/style-gpt/confirmation",
];

export default function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get("accessToken")?.value;

  // Extract the invite_code URL parameter from the query string
  const url = new URL(req.url, req.nextUrl.origin);
  const inviteCode = url.searchParams.get("invite_code");

  if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/", req.nextUrl.origin);
    // Check if the invite_code parameter is present and valid
    if (inviteCode) {
      // Redirect to "/" if the invite code is valid
      return NextResponse.redirect(
        `${absoluteURL.toString()}?invite_code=${inviteCode}`
      );
    }
    return NextResponse.redirect(absoluteURL.toString());
  }
}

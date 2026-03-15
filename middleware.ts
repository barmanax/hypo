// Auth disabled for local screenshots — re-enable by restoring:
// export { auth as middleware } from "@/auth";

export function middleware() {}

export const config = {
  matcher: ["/dashboard/:path*", "/experiments/:path*"],
};

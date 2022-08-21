export const config = {
  matcher: ["/chapters/:path*"],
};

export function middleware(req) {
  return Response.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/chapters/:path*"],
};

export function middleware(req) {
  const url = req.nextUrl;
  if (url.includes("pass")) {
    return Response.next();
  }

  url.pathname = "/login";

  return Response.rewrite(url);
}

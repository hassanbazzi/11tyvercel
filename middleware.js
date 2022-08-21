export const config = {
  matcher: ["/chapters/:path*"],
};

export function middleware(req) {
  const url = req.nextUrl;
  if (url.indexOf("pass") !== -1) {
    return Response.next();
  }

  url.pathname = "/login";

  return Response.rewrite(url);
}

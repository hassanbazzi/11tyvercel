export const config = {
  matcher: ["/chapters/:path*"],
};

export default function middleware(req) {
  console.log("req", req);
  return Response.redirect(new URL("/login", req.url));
}

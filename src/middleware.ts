import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// docs: https://labs.convex.dev/auth/authz/nextjs#require-authentication-for-certain-routes
const isAuthPage = createRouteMatcher(["/auth(.*)"]);
const isPublicRoute = createRouteMatcher(["/auth(.*)"]);

export default convexAuthNextjsMiddleware((request, { convexAuth }) => {
  // redirect authenticated users away from auth page
  if (isAuthPage(request) && convexAuth.isAuthenticated()) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  // redirect unauthenticated users to auth page for protected routes
  if (!isPublicRoute(request) && !convexAuth.isAuthenticated()) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

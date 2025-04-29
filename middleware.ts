// middleware.ts this file is used to protect the routes in your app
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


// Public routes that do not require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing"
]);

export default clerkMiddleware(async (auth, req): Promise<void> => {
  // protect all the routes except the public ones
  if (!isPublicRoute(req)) {
    await auth.protect(); // if route is not public, protect it
  }
})

// this is config used to match for your middleware apllication
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
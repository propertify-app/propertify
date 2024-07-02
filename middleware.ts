import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/(.*)']);
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)'])
export default clerkMiddleware(async (auth, request) => {

  if(isPublicRoute(request)) {
    return NextResponse.next()
  }

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if(!userId && !isPublicRoute(request)) {
    return redirectToSignIn({ returnBackUrl: request.url });
  }

  if (userId && sessionClaims?.metadata?.onboardingStep !== "complete") {
    const onboardingUrl = new URL(`/onboarding/${sessionClaims?.metadata?.onboardingStep ?? "user"}`, request.url);
    
    if (onboardingUrl.pathname !== new URL(request.url).pathname) {
      return NextResponse.redirect(onboardingUrl);
    } else {
      return NextResponse.next()
    }
  } else if(sessionClaims?.metadata?.onboardingStep === "complete" && isOnboardingRoute(request)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (userId && !isPublicRoute(request)) return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
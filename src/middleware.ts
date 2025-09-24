import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware((auth, req) => { 
  if (!isPublicRoute(req)) {
    auth.protect();
  }
})
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
// //không cần async , await nếu bạn chỉ muốn "bắt buộc login" cho tất cả các trang trừ trang công khai
// //cần async , await nếu bạn muốn làm thêm các việc khác như kiểm tra role, redirect, v.v

import type { ReactNode } from 'react'

interface AuthLayoutProps {
  bannerSrc: string
  bannerAlt: string
  children: ReactNode
}

/**
 * Base layout shared by the login and signup screens.
 * Only the banner and the form content change between them.
 */
export function AuthLayout({ bannerSrc, bannerAlt, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-page p-4 sm:p-8">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-10 rounded-3xl bg-surface p-6 sm:p-10 lg:grid-cols-2 lg:gap-16">
        <img
          src={bannerSrc}
          alt={bannerAlt}
          className="mx-auto hidden h-auto w-full max-w-md rounded-2xl object-cover md:block lg:max-w-none"
        />
        <div className="flex flex-col justify-center gap-8">{children}</div>
      </div>
    </main>
  )
}

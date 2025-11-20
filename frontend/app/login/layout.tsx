import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@/styles/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SSIS | Login",
  description: "Login to Student Information System",
  icons: {
    icon: "/heart.svg",
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground flex min-h-screen items-center justify-center antialiased`}
      >
        <main className="bg-card flex w-full max-w-4xl justify-center rounded-2xl p-8 shadow-lg">
          {children}
        </main>
      </body>
    </html>
  )
}

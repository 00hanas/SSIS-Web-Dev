import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SSIS | Sign Up",
  description: "Signup to Student Information System",
  icons: {
    icon: "/heart.svg",
  },
}

export default function SigninLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex items-center justify-center bg-background text-foreground`}
      >
        <main className="w-full max-w-4xl p-8 rounded-2xl shadow-lg bg-card flex justify-center">
          {children}
        </main>
      </body>
    </html>
  )
}

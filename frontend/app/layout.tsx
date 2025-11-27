import type { Metadata } from "next"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/global/theme-provider"
import { geistSans, geistMono } from "@/lib/fonts"

export const metadata: Metadata = {
  title: "SSIS",
  description: "Student Information System",
  icons: {
    icon: "/heart.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

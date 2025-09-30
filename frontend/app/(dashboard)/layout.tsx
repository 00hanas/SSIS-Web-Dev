import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { VerticalSeparator } from "@/components/separator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSIS",
  description: "Student Information System",
  icons: {
    icon: "/heart.svg",
  },
};

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col w-full">
              <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2 h-6">
                  <SidebarTrigger />
                  <VerticalSeparator />
                  <h1 className="text-xl font-bold">Student Information System</h1>
                </div>
                <div className="flex items-center gap-2">
                <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                  <a
                    href="https://github.com/00hanas/SSIS-Web-Dev"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="dark:text-foreground"
                  >
                    GitHub
                  </a>
                </Button>
                <ModeToggle />
              </div>
              </header>
              <main className="p-4">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/global/app-sidebar"
import { AppHeader } from "@/components/global/app-header"

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <AppHeader />
        <main className="p-4">{children}</main>
      </div>
    </SidebarProvider>
  )
}

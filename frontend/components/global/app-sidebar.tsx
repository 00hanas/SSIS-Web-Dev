"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  DashboardOutlined as DashboardIcon,
  School as CollegeIcon,
  LibraryBooks as ProgramIcon,
  EmojiPeople as StudentIcon,
  MoreVertSharp as DotsIcon,
  Logout as IconLogout,
} from "@mui/icons-material"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"

const items = [
  { title: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { title: "Colleges", href: "/colleges", icon: CollegeIcon },
  { title: "Programs", href: "/programs", icon: ProgramIcon },
  { title: "Students", href: "/students", icon: StudentIcon },
]

export function AppSidebar() {
  const { open, isMobile } = useSidebar()
  const pathname = usePathname()
  const user = useCurrentUser()
  const { logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)

  return (
    <Sidebar collapsible="icon" className="data-[collapsible=icon]:w-20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.href}
                        className={`flex items-center gap-2 rounded transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-muted"
                        }`}
                        title={!open ? item.title : undefined}
                      >
                        <item.icon fontSize="small" />
                        {open && <span>{item.title}</span>}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user && (
        <SidebarFooter className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
              >
                <div
                  className={`w-full ${
                    open
                      ? "flex items-center justify-between gap-3"
                      : "flex justify-center"
                  }`}
                >
                  <div className="h-10 w-10 flex-shrink-0">
                    <Image
                      src="/icon.jpg"
                      alt="Profile"
                      width={100}
                      height={100}
                      className="!h-10 !w-10 rounded-full object-cover"
                    />
                  </div>
                  {open && (
                    <div className="flex flex-1 items-center justify-between overflow-hidden">
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-medium">
                          {user.name}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {user.email}
                        </span>
                      </div>
                      <DotsIcon className="ml-3 size-4 flex-shrink-0" />
                    </div>
                  )}
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="h-10 w-10 flex-shrink-0">
                    <Image
                      src="/icon.jpg"
                      alt="Profile"
                      width={100}
                      height={100}
                      className="!h-10 !w-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="block truncate font-medium">
                      {user.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <IconLogout className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to log out?
          </p>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={() => {
                setShowLogoutConfirm(false)
                logout()
              }}
            >
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}

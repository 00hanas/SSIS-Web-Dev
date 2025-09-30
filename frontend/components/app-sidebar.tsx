"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
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
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useAuth } from "@/hooks/useAuth"


const items = [
  { title: "Colleges", href: "/colleges", icon: CollegeIcon },
  { title: "Programs", href: "/programs", icon: ProgramIcon },
  { title: "Students", href: "/students", icon: StudentIcon },
]

export function AppSidebar() {
  const { open, isMobile } = useSidebar()
  const pathname = usePathname()
  const user = useCurrentUser()
  const { logout } = useAuth()

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
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={`w-full ${
                  open
                    ? "flex items-center justify-between gap-3"
                    : "flex justify-center"
                }`}
              >
                <div className="w-10 h-10 flex-shrink-0">
                  <img
                    src="/2by2.png"
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                {open && (
                  <div className="flex flex-1 items-center justify-between overflow-hidden">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
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
                <div className="w-10 h-10 flex-shrink-0">
                  <img
                    src="/2by2.png"
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="block font-medium truncate">{user.name}</span>
                <span className="text-muted-foreground text-xs truncate">
                  {user.email}
                </span>
              </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <IconLogout className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    )}
    </Sidebar>
  )
}

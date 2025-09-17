"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import {
  School as CollegeIcon,
  LibraryBooks as ProgramIcon,
  EmojiPeople as StudentIcon,
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
  useSidebar
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Colleges",
    href: "/colleges",
    icon: CollegeIcon,
  },
  {
    title: "Programs",
    href: "/programs",
    icon: ProgramIcon,
  },
  {
    title: "Students",
    href: "/students",
    icon: StudentIcon,
  },
]

export function AppSidebar() {
    const { open } = useSidebar()
    const pathname = usePathname()

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
      <SidebarFooter>
        <div
            className={`flex items-center gap-3 p-3 border-t ${
            open ? "justify-start" : "justify-center"
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
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">
                Juhanara Saluta
                </span>
                <span className="text-xs text-muted-foreground truncate">
                juhanara.saluta@g.msuiit.edu.ph
                </span>
            </div>
            )}
        </div>
        </SidebarFooter>
    </Sidebar>
  )
}

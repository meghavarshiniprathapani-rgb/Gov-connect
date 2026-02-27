'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardList,
  FileStack,
  Settings,
  Shield,
  Search,
  ChevronRight,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      url: '/app/dashboard',
    },
    {
      title: 'Communications',
      icon: MessageSquare,
      url: '/app/communication',
    },
    {
      title: 'Workflows & Tasks',
      icon: ClipboardList,
      url: '/app/tasks',
    },
    {
      title: 'Document Vault',
      icon: FileStack,
      url: '/app/documents',
    },
  ];

  const govLinks = [
    { title: 'Citizen Services', url: '/services' },
    { title: 'Public Grievance', url: 'https://pgportal.gov.in/' },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border shadow-xl">
      <SidebarHeader className="p-4">
        <Logo className="text-white scale-90 origin-left" />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 font-bold tracking-wider text-[10px] uppercase px-4 mb-2">
            Main Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="hover:bg-sidebar-accent transition-colors"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-sidebar-foreground/50 font-bold tracking-wider text-[10px] uppercase px-4 mb-2">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-sidebar-accent transition-colors">
                  <Search className="size-4" />
                  <span>External Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {govLinks.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton asChild className="hover:bg-sidebar-accent transition-colors">
                    <Link href={link.url}>
                      <ChevronRight className="size-4" />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-sidebar-accent transition-colors">
              <Settings className="size-4" />
              <span>System Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

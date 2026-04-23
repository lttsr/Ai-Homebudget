import { type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Menu, ChevronLeft, ChartBar } from "lucide-react";
import { cn } from "@/lib/utils";

type LayoutNavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

type SidebarNavProps = {
  layoutRoutes: LayoutNavItem[];
};

function SidebarNav({ layoutRoutes }: SidebarNavProps) {
  const { pathname } = useLocation();

  const isActive = (urlPath: string, end: boolean) => {
    if (end) {
      return pathname === urlPath;
    }
    return pathname === urlPath || pathname.startsWith(`${urlPath}/`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-0 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/40">
        メニュー
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {layoutRoutes.map((route) => {
            const to = route.path.startsWith("/")
              ? route.path
              : `/${route.path}`;
            const Icon = route.icon;
            const active = isActive(to, route.end === true);
            return (
              <SidebarMenuItem key={route.path}>
                <SidebarMenuButton asChild isActive={active} size="default">
                  <NavLink to={to} end={route.end === true}>
                    <Icon className="shrink-0" />
                    <span className="font-medium">{route.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

type AppSidebarProps = {
  children: ReactNode;
  layoutRoutes: LayoutNavItem[];
};

function SidebarOpenClose() {
  const { isMobile, state, openMobile, toggleSidebar } = useSidebar();
  const is_open = isMobile ? openMobile : state === "expanded";
  const show_open_icon = !is_open;

  return (
    <Button
      type="button"
      data-slot="sidebar-open-close"
      variant="ghost"
      size="icon-sm"
      className={cn(
        "shrink-0 text-sidebar-foreground/80 hover:bg-sidebar-accent/80",
        "hover:text-sidebar-foreground",
      )}
      onClick={toggleSidebar}
      aria-label={show_open_icon ? "サイドバーを開く" : "サイドバーを畳む"}
      aria-expanded={is_open}
    >
      {show_open_icon ? (
        <Menu className="size-4" aria-hidden />
      ) : (
        <ChevronLeft className="size-4" aria-hidden />
      )}
    </Button>
  );
}

export function AppSidebar({ children, layoutRoutes }: AppSidebarProps) {
  return (
    <SidebarProvider className="min-h-svh w-full" defaultOpen={true}>
      <Sidebar className="border-r border-sidebar-border/80 bg-linear-to-b from-sidebar to-sidebar/95">
        <SidebarHeader className="gap-0 border-b border-sidebar-border/70 px-0 pb-3 pt-2">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 px-2 py-2">
            <ChartBar className="shrink-0" />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold leading-tight tracking-tight text-sidebar-foreground">
                AI-HomeBudget
              </p>
              <p className="mt-0.5 truncate text-xs text-sidebar-foreground/55">
                家計の見える化
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-0 pt-2">
          <SidebarNav layoutRoutes={layoutRoutes} />
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border/70 py-2">
          <p className="px-1 text-center text-[0.7rem] leading-relaxed text-sidebar-foreground/40">
            見える家計
            <br />
            安心して使える
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-h-0 flex-1 flex-col bg-slate-50/90">
        <div
          className="flex h-12 shrink-0 items-center gap-2 border-b border-border/50 bg-slate-50/95 px-2 backdrop-blur-sm md:pl-2"
          id="sidebar-inset-toolbar"
        >
          <SidebarOpenClose />
        </div>
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

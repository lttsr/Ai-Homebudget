import { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  LayoutGrid,
  MessageCircle,
  ChartNoAxesCombined,
} from "lucide-react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/sidebar";
import { AskAI } from "@/features/ask/Ask-AI";
import { ManagementHome } from "@/features/management/Management";

type RouteItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  element: ReactNode;
  end?: boolean;
};

/**
 * ルート定義
 */
const LAYOUT_ROUTES: RouteItem[] = [
  {
    path: "/",
    label: "ホーム",
    icon: Home,
    element: <div />,
    end: true,
  },
  {
    path: "/ask-ai",
    label: "家計相談",
    icon: MessageCircle,
    element: <AskAI />,
  },
  {
    path: "/management",
    label: "管理",
    icon: LayoutGrid,
    element: <ManagementHome />,
  },
  {
    path: "/analysis",
    label: "データ分析",
    icon: ChartNoAxesCombined,
    element: <div />,
  },
];

function AppLayout() {
  return (
    <AppSidebar layoutRoutes={LAYOUT_ROUTES}>
      <Outlet />
    </AppSidebar>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<AppLayout />}>
        <Route index element={<Navigate to="/" replace />} />
        {LAYOUT_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}

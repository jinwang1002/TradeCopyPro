import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  userRole?: "provider" | "subscriber";
  username?: string;
  avatarUrl?: string;
  notificationCount?: number;
}

const DashboardLayout = ({
  userRole = "provider",
  username = "TraderJoe",
  avatarUrl = "",
  notificationCount = 3,
}: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar
        userRole={userRole}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      <div className="relative flex-1 flex flex-col overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-[22px] left-2 z-10 text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </Button>

        <Header
          username={username}
          avatarUrl={avatarUrl}
          role={userRole}
          notificationCount={notificationCount}
        />

        <main className="flex-1 overflow-auto p-6 bg-gray-950">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

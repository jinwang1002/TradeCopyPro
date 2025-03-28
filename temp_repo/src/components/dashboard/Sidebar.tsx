import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart3,
  Home,
  LineChart,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  TrendingUp,
  Wallet,
  PieChart,
  History,
  DollarSign,
} from "lucide-react";

interface SidebarProps {
  userRole?: "provider" | "subscriber";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}

const NavItem = ({
  icon,
  label,
  href,
  active = false,
  collapsed = false,
}: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={href} className="block">
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              className={cn(
                "w-full justify-start mb-1",
                active
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <div
                className={cn(
                  "flex items-center",
                  collapsed ? "justify-center" : "",
                )}
              >
                <span className={cn("mr-2", collapsed ? "mr-0" : "")}>
                  {icon}
                </span>
                {!collapsed && <span>{label}</span>}
              </div>
            </Button>
          </Link>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = ({
  userRole = "subscriber",
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        path === "/dashboard" ||
        path === "/dashboard/provider" ||
        path === "/dashboard/subscriber"
      );
    }
    return path.startsWith(href);
  };

  const providerNavItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/dashboard/provider",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Observer Accounts",
      href: "/dashboard/provider/observers",
    },
    {
      icon: <LineChart size={20} />,
      label: "Performance",
      href: "/dashboard/provider/performance",
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Trades",
      href: "/dashboard/provider/trades",
    },
    {
      icon: <DollarSign size={20} />,
      label: "Earnings",
      href: "/dashboard/provider/earnings",
    },
  ];

  const subscriberNavItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/dashboard/subscriber",
    },
    {
      icon: <Wallet size={20} />,
      label: "Trade Accounts",
      href: "/dashboard/subscriber/accounts",
    },
    {
      icon: <Users size={20} />,
      label: "Subscriptions",
      href: "/dashboard/subscriber/subscriptions",
    },
    {
      icon: <History size={20} />,
      label: "Copied Trades",
      href: "/dashboard/subscriber/trades",
    },
  ];

  const commonNavItems = [
    { icon: <PieChart size={20} />, label: "Providers", href: "/providers" },
    { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
    { icon: <HelpCircle size={20} />, label: "Help", href: "/help" },
  ];

  const navItems =
    userRole === "provider" ? providerNavItems : subscriberNavItems;

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "p-4 flex items-center",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && <h2 className="text-xl font-bold">TradeRiser</h2>}
        {collapsed && <div className="text-xl font-bold">TR</div>}
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="py-2">
          <div className={cn("mb-1 px-2", collapsed ? "text-center" : "")}>
            {!collapsed && (
              <p className="text-xs font-medium text-muted-foreground">MAIN</p>
            )}
          </div>
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}

          <Separator className="my-4" />

          <div className={cn("mb-1 px-2", collapsed ? "text-center" : "")}>
            {!collapsed && (
              <p className="text-xs font-medium text-muted-foreground">
                GENERAL
              </p>
            )}
          </div>
          {commonNavItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <NavItem
          icon={<LogOut size={20} />}
          label="Logout"
          href="/auth"
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default Sidebar;

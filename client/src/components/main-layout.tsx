import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  LayoutDashboard,
  Users,
  RefreshCw,
  BarChart2,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Different navigation items based on user role
  const getNavigation = () => {
    const baseNavItems = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        active: location === "/dashboard",
      },
      {
        name: "Providers",
        href: "/providers",
        icon: Users,
        active: location.startsWith("/providers"),
      },
      {
        name: "Accounts",
        href: "/accounts",
        icon: BarChart2,
        active: location === "/accounts" || location.startsWith("/trade-accounts"),
      },
      {
        name: "Profile",
        href: "/profile",
        icon: User,
        active: location === "/profile",
      },
    ];
    
    // Only add Subscriptions link for regular subscribers
    if (user?.role !== 'provider') {
      baseNavItems.splice(3, 0, {
        name: "Subscriptions",
        href: "/subscriptions",
        icon: RefreshCw,
        active: location === "/subscriptions",
      });
    }
    
    return baseNavItems;
  };

  const navigation = getNavigation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Handle home page and non-authenticated state
  if (!user) {
    // Check if we're on the home page
    if (location === "/") {
      return (
        <div className="min-h-screen bg-black flex flex-col">
          <div className="flex h-16 border-b border-gray-800 items-center px-4">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <span className="text-green-500 font-bold text-xl">TradeRiser</span>
              </div>
            </Link>
            <div className="ml-auto flex gap-2">
              <Link href="/auth">
                <Button variant="outline" size="sm" className="text-gray-300 border-gray-700 hover:bg-gray-900 hover:text-white">
                  Log In
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 bg-black">{children}</div>
        </div>
      );
    }
    
    // For other non-authenticated pages
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="flex h-16 border-b border-gray-800 items-center px-4">
          <Skeleton className="h-10 w-40 bg-gray-800" />
          <div className="ml-auto">
            <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="hidden md:flex w-64 flex-col border-r border-gray-800 p-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full mb-2 bg-gray-800" />
              ))}
          </div>
          <div className="flex-1 p-4 bg-black">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Mobile header */}
      <div className="md:hidden flex h-16 border-b border-gray-800 items-center px-4">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <span className="text-green-500 font-bold text-xl">TradeRiser</span>
          </div>
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto text-gray-300">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r border-gray-800 bg-black">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center cursor-pointer">
                    <span className="text-green-500 font-bold text-xl">TradeRiser</span>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5 text-gray-300" />
                </Button>
              </div>
              
              <nav className="flex-1 p-4">
                <p className="text-xs font-medium text-gray-400 mb-2 uppercase">Menu</p>
                <ul className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start",
                            item.active 
                              ? "bg-gray-900/50 text-white border-l-2 border-green-500" 
                              : "text-gray-400 hover:bg-gray-900/30 hover:text-gray-300"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          <span>{item.name}</span>
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="border-t border-gray-800 p-4">
                <div className="flex items-center p-2 bg-gray-900/30 rounded-lg">
                  <div className="h-9 w-9 rounded-full bg-[#141414] border border-gray-700 flex items-center justify-center text-sm font-medium text-white">
                    {user.displayName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user.displayName}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mt-3 text-gray-400 hover:text-white hover:bg-gray-900/30"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop sidebar */}
      <div className="flex-1 flex">
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-black border-r border-gray-800 z-10">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center h-16 px-4 border-b border-gray-800">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <span className="text-green-500 font-bold text-xl">TradeRiser</span>
                </div>
              </Link>
            </div>
            
            <nav className="flex-1 p-4">
              <p className="text-xs font-medium text-gray-400 mb-2 uppercase">Menu</p>
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          item.active 
                            ? "bg-gray-900/50 text-white border-l-2 border-green-500" 
                            : "text-gray-400 hover:bg-gray-900/30 hover:text-gray-300"
                        )}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="border-t border-gray-800 pt-4 mt-4 px-4 pb-4">
              <div className="flex items-center p-2 bg-gray-900/30 rounded-lg">
                <div className="h-9 w-9 rounded-full bg-[#141414] border border-gray-700 flex items-center justify-center text-sm font-medium text-white">
                  {user.displayName.substring(0, 2).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user.displayName}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start mt-3 text-gray-400 hover:text-white hover:bg-gray-900/30"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className={cn("flex-1 bg-black", { "md:ml-64": user })}>
          {children}
        </main>
      </div>
    </div>
  );
}

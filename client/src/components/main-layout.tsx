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

  const navigation = [
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
      name: "Subscriptions",
      href: "/subscriptions",
      icon: RefreshCw,
      active: location === "/subscriptions",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: location === "/profile",
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Handle home page and non-authenticated state
  if (!user) {
    // Check if we're on the home page
    if (location === "/") {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <div className="flex h-16 border-b items-center px-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <LineChart className="h-5 w-5 text-white" />
              </div>
              <h1 className="font-heading font-bold text-lg ml-2">TradeRiser</h1>
            </div>
            <div className="ml-auto flex gap-2">
              <a href="/auth">
                <Button variant="outline" size="sm">Log In</Button>
              </a>
              <a href="/auth">
                <Button size="sm">Sign Up</Button>
              </a>
            </div>
          </div>
          <div className="flex-1">{children}</div>
        </div>
      );
    }
    
    // For other non-authenticated pages
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex h-16 border-b items-center px-4">
          <Skeleton className="h-10 w-40" />
          <div className="ml-auto">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="hidden md:flex w-64 flex-col border-r p-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full mb-2" />
              ))}
          </div>
          <div className="flex-1 p-4">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile header */}
      <div className="md:hidden flex h-16 border-b items-center px-4">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <LineChart className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-heading font-bold text-lg ml-2">TradeRiser</h1>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex flex-col h-full bg-background">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                    <LineChart className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="font-heading font-bold text-lg ml-2">TradeRiser</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex-1 p-4">
                <ul className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href}>
                        <Button
                          variant={item.active ? "default" : "ghost"}
                          className="w-full justify-start"
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
              
              <div className="border-t p-4">
                <div className="flex items-center px-2 py-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-white">
                    {user.displayName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mt-2 text-muted-foreground hover:text-foreground hover:bg-accent"
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
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-background border-r z-10">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center h-16 px-4 border-b">
              <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center">
                <LineChart className="h-6 w-6 text-white" />
              </div>
              <h1 className="font-heading font-bold text-xl ml-3">TradeRiser</h1>
            </div>
            
            <nav className="flex-1 p-4">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <Button
                        variant={item.active ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="border-t pt-4 mt-4 px-4 pb-4">
              <div className="flex items-center px-2 py-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-white">
                  {user.displayName.substring(0, 2).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start mt-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className={cn("flex-1", { "md:ml-64": user })}>
          {children}
        </main>
      </div>
    </div>
  );
}

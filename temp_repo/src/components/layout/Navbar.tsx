import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, Users, LayoutDashboard, LogIn, Menu } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: "provider" | "subscriber";
}

const Navbar = ({
  isAuthenticated = false,
  userRole = "subscriber",
}: NavbarProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Providers",
      path: "/providers",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: "Dashboard",
      path: isAuthenticated
        ? userRole === "provider"
          ? "/dashboard/provider"
          : "/dashboard/subscriber"
        : "/auth",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <nav className="bg-black border-b border-gray-800 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-green-500 font-bold text-xl">
                TradeRiser
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    location.pathname === item.path
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center">
            {!isAuthenticated ? (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="mr-2">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full h-8 w-8 p-0"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="rounded-full bg-gray-700 h-8 w-8 flex items-center justify-center text-white">
                      {userRole === "provider" ? "P" : "S"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button className="w-full text-left text-red-500">
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                  location.pathname === item.path
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/auth"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login / Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-700 hover:text-red-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

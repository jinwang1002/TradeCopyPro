import React from "react";
import { Bell, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  username?: string;
  avatarUrl?: string;
  role?: "provider" | "subscriber";
  notificationCount?: number;
}

const Header = ({
  username = "TraderJoe",
  avatarUrl = "",
  role = "provider",
  notificationCount = 3,
}: HeaderProps) => {
  return (
    <header className="bg-black border-b border-gray-800 h-[70px] w-full px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-white">
          {role === "provider" ? "Provider Dashboard" : "Subscriber Dashboard"}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-300" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 bg-green-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-gray-300" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback className="bg-gray-800 text-white">
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-white">{username}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-gray-900 text-white border-gray-800"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-800">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-800">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-gray-800 hover:text-red-400">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

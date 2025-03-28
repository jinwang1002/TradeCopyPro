import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { TrendingUp, Users, Award, Clock, Star } from "lucide-react";

interface ProfileHeaderProps {
  provider?: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    joinDate: string;
    totalSubscribers: number;
    totalAccounts: number;
    avgReturn: number;
    avgWinRate: number;
    avgDrawdown: number;
    verified: boolean;
  };
}

const ProfileHeader = ({
  provider = {
    id: "1",
    name: "TraderJoe",
    avatar: "",
    bio: "Professional forex trader with 10+ years of experience. Specializing in swing trading major pairs with consistent returns.",
    joinDate: "Jan 2023",
    totalSubscribers: 248,
    totalAccounts: 3,
    avgReturn: 87.5,
    avgWinRate: 68,
    avgDrawdown: 12.3,
    verified: true,
  },
}: ProfileHeaderProps) => {
  return (
    <Card className="w-full bg-black border-gray-800">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and basic info */}
          <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-green-500">
                <AvatarImage
                  src={
                    provider.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.name}`
                  }
                  alt={provider.name}
                />
                <AvatarFallback>
                  {provider.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">
                    {provider.name}
                  </h1>
                  {provider.verified && (
                    <Badge className="bg-green-500 text-black">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>Member since {provider.joinDate}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mt-2">{provider.bio}</p>
            <div className="flex gap-3 mt-2">
              <Button className="bg-green-500 hover:bg-green-600 text-black">
                Subscribe
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Message
              </Button>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="hidden md:block h-auto bg-gray-800"
          />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:w-2/3">
            <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg">
              <Users className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-2xl font-bold text-white">
                {provider.totalSubscribers}
              </span>
              <span className="text-gray-400 text-sm">Subscribers</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg">
              <Award className="h-8 w-8 text-purple-400 mb-2" />
              <span className="text-2xl font-bold text-white">
                {provider.totalAccounts}
              </span>
              <span className="text-gray-400 text-sm">Signal Accounts</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-2xl font-bold text-green-500">
                +{provider.avgReturn}%
              </span>
              <span className="text-gray-400 text-sm">Avg. Return</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg">
              <Star className="h-8 w-8 text-yellow-400 mb-2" />
              <span className="text-2xl font-bold text-white">
                {provider.avgWinRate}%
              </span>
              <span className="text-gray-400 text-sm">Avg. Win Rate</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg col-span-2 md:col-span-1">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-red-900">
                  <TrendingUp className="h-5 w-5 text-red-400 transform rotate-180" />
                </div>
              </div>
              <span className="text-2xl font-bold text-red-500">
                {provider.avgDrawdown}%
              </span>
              <span className="text-gray-400 text-sm">Avg. Drawdown</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;

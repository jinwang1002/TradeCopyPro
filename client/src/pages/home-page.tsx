import { MainLayout } from "@/components/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, TrendingUp, Shield, Users, BarChart4, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SignalProviderCard } from "@/components/signal-provider-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const [roleSelected, setRoleSelected] = useState<string | null>(null);

  // Fetch top performing signal accounts
  const { data: topProviders, isLoading: isTopProvidersLoading } = useQuery({
    queryKey: ["/api/signal-accounts/top?limit=3"],
  });

  const handleRoleSelect = (role: string) => {
    setRoleSelected(role);
    setTimeout(() => {
      navigate("/dashboard");
    }, 300);
  };

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (user) return null;

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="py-12 md:py-20 px-4 md:px-12 bg-gradient-to-br from-primary/10 to-primary/5">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Elevate Your Trading with <span className="text-primary">TradeRiser</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                  Connect with expert traders, copy their strategies, and maximize your trading potential.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth">
                    <Button size="lg" className="px-8">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-r-3xl h-full min-h-[400px] bg-gradient-to-tr from-primary/80 to-primary/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative z-10 p-6">
                  {/* Trading terminal visual */}
                  <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg shadow-xl w-full max-w-md border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-white font-semibold">EURUSD Chart</div>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="h-32 mb-4 bg-black/30 rounded relative overflow-hidden">
                      {/* Faux chart */}
                      <div className="absolute h-px w-full bg-green-500/30 top-1/2"></div>
                      <svg 
                        viewBox="0 0 200 100" 
                        className="h-full w-full" 
                        preserveAspectRatio="none"
                      >
                        <polyline
                          points="0,50 20,45 40,55 60,40 80,60 100,35 120,55 140,30 160,45 180,25 200,40"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-black/40 p-2 rounded text-xs text-white">
                        <div className="text-green-500">+1.24%</div>
                        <div className="text-gray-400 text-[10px]">Daily</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded text-xs text-white">
                        <div className="text-red-500">-0.34%</div>
                        <div className="text-gray-400 text-[10px]">Weekly</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded text-xs text-white">
                        <div className="text-green-500">+8.76%</div>
                        <div className="text-gray-400 text-[10px]">Monthly</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Small trading widgets */}
                  <div className="flex mt-4 gap-2">
                    <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-white/10 text-white text-xs flex-1">
                      <div className="font-bold">BTCUSD</div>
                      <div className="flex items-center justify-between">
                        <div>42,356.89</div>
                        <div className="text-green-500">+2.4%</div>
                      </div>
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-white/10 text-white text-xs flex-1">
                      <div className="font-bold">GOLD</div>
                      <div className="flex items-center justify-between">
                        <div>1,823.45</div>
                        <div className="text-red-500">-0.8%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute top-20 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Why Choose TradeRiser?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform connects signal providers with subscribers in a transparent, secure, and performance-driven environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle>Performance Tracking</CardTitle>
                <CardDescription>
                  Real-time performance metrics and historical data analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track your trading performance with advanced analytics. Monitor profit/loss, win rate, drawdown and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle>Secure Copy Trading</CardTitle>
                <CardDescription>
                  Automated trade copying with customizable risk management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set lot size multipliers, select trading pairs, and apply stop-loss/take-profit parameters to manage risk effectively.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Trading Community</CardTitle>
                <CardDescription>
                  Connect with successful traders and like-minded investors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Engage with our community through comments, reviews, and feedback on signal providers to make informed decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Performing Providers</h2>
            <Link href="/providers">
              <Button variant="ghost" className="text-primary">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isTopProvidersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProviders?.map((provider: any, index: number) => (
                <SignalProviderCard
                  key={provider.id}
                  provider={provider}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Trading Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join TradeRiser today and connect with top-performing traders from around the world.
            </p>
            <Link href="/auth">
              <Button size="lg" className="px-8">
                Create Your Account
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              TradeRiser makes copy trading simple, transparent, and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your account and choose your role as a signal provider or subscriber.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-muted-foreground">
                Add your trading accounts or browse and subscribe to top-performing signal providers.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trade & Grow</h3>
              <p className="text-muted-foreground">
                Start copying trades automatically and track your performance in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

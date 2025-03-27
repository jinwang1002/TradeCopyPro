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
        <div className="relative py-12 md:py-20 px-4 md:px-12 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 mb-12">
          <div className="max-w-3xl">
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
          <div className="absolute right-0 bottom-0 -z-10 opacity-20">
            <TrendingUp className="w-64 h-64 text-primary" />
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

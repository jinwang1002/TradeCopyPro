import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LineChart, ChartContainer } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "subscriber",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left panel - Auth forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center mr-3">
                <LineChart className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">TradeRiser</CardTitle>
            </div>
            <CardDescription>
              Sign in to access your trade copy dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="yourusername" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="yourusername" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Trading Joe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>I am a</FormLabel>
                          <div className="flex space-x-4">
                            <Button 
                              type="button" 
                              className={field.value === "subscriber" ? "bg-primary" : "bg-muted hover:bg-muted/80"}
                              onClick={() => registerForm.setValue("role", "subscriber")}
                            >
                              Subscriber
                            </Button>
                            <Button 
                              type="button" 
                              className={field.value === "provider" ? "bg-primary" : "bg-muted hover:bg-muted/80"}
                              onClick={() => registerForm.setValue("role", "provider")}
                            >
                              Signal Provider
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center w-full">
              By continuing, you agree to TradeRiser's Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right panel - Hero section */}
      <div className="w-full md:w-1/2 bg-primary hidden md:flex flex-col justify-center items-center text-white p-8">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">Copy Trading Made Simple</h1>
          <p className="text-lg mb-8">
            Join the TradeRiser community to copy trades from expert signal providers or share your trading strategy with subscribers.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold mb-2">For Subscribers</h3>
              <p className="text-sm">Copy trades from top performers with custom settings. Track performance and manage multiple accounts.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-bold mb-2">For Providers</h3>
              <p className="text-sm">Share your trading strategy, grow your subscriber base, and earn rewards based on performance.</p>
            </div>
          </div>
          <div className="text-sm opacity-80">
            "TradeRiser has transformed how I manage my trading portfolio. The automated trade copying saves me hours of manual work."
            <div className="font-bold mt-2">— Sarah K., Active Trader</div>
          </div>
        </div>
      </div>
    </div>
  );
}

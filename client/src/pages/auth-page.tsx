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
import { LineChart } from "lucide-react";

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
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Left panel - Auth forms */}
      <div className="w-full md:w-[45%] flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md tempo-card">
          <CardHeader className="space-y-1 pb-2">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-gradient-to-tr from-green-500 to-green-600 rounded-md flex items-center justify-center mr-3">
                <LineChart className="h-6 w-6 text-black" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">TradeRiser</CardTitle>
                <CardDescription className="text-gray-400">
                  Sign in to access your dashboard
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#141414] p-1 rounded-md">
                <TabsTrigger 
                  value="login" 
                  className={`tab-trigger-active ${activeTab === 'login' ? '' : 'text-gray-400'}`}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className={`tab-trigger-active ${activeTab === 'register' ? '' : 'text-gray-400'}`}
                >
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="yourusername" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-green-500 hover:bg-green-600 text-black" 
                      disabled={loginMutation.isPending}
                    >
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
                          <FormLabel className="text-gray-300">Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="yourusername" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Display Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Trading Joe" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="you@example.com" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">I am a</FormLabel>
                          <div className="grid grid-cols-2 gap-4 mt-1">
                            <Button 
                              type="button" 
                              variant="outline"
                              className={`${field.value === "subscriber" 
                                ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                                : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600"}`}
                              onClick={() => registerForm.setValue("role", "subscriber")}
                            >
                              Subscriber
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline"
                              className={`${field.value === "provider" 
                                ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                                : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600"}`}
                              onClick={() => registerForm.setValue("role", "provider")}
                            >
                              Signal Provider
                            </Button>
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-green-500 hover:bg-green-600 text-black" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-gray-500 border-t border-gray-800 mt-4">
            <div className="text-sm text-center w-full">
              By continuing, you agree to TradeRiser's Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right panel - Hero section */}
      <div className="w-full md:w-1/2 bg-black hidden md:flex flex-col justify-center items-center text-white p-8 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 -left-10 w-64 h-64 bg-green-500/5 rounded-full filter blur-2xl"></div>
        
        <div className="max-w-md text-center relative z-10">
          <h1 className="text-4xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
              Copy Trading
            </span>
            <span className="block">Made Simple</span>
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            Join the TradeRiser community to copy trades from expert signal providers or share your trading strategy with subscribers.
          </p>
          
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-left shadow-lg">
              <div className="flex items-start mb-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Advanced Performance Analytics</h3>
                  <p className="text-gray-400 mt-1">Track every metric from win rate to drawdown with our comprehensive analytics suite</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Flexible Copy Settings</h3>
                  <p className="text-gray-400 mt-1">Customize your trade copying with lot size multipliers and risk management options</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 bg-gray-900 p-4 rounded-lg border border-gray-800">
            "TradeRiser has transformed how I manage my trading portfolio. The automated trade copying saves me hours of manual work every day."
            <div className="font-bold mt-2 text-white">— Sarah K., Active Trader</div>
          </div>
        </div>
      </div>
    </div>
  );
}

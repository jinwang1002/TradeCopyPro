import React, { useState } from "react";
import { signIn, signUp, getCurrentUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import RoleSelector from "./RoleSelector";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// Registration form schema
const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  displayName: z
    .string()
    .min(3, { message: "Display name must be at least 3 characters" }),
  role: z.enum(["subscriber", "provider"]),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  defaultTab?: "login" | "register";
}

const AuthForm = ({ defaultTab = "login" }: AuthFormProps) => {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      role: "subscriber",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      const { success, error, session } = await signIn(
        data.email,
        data.password,
      );
      if (success) {
        const { success: userSuccess, user } = await getCurrentUser();
        if (userSuccess && user) {
          console.log(
            "Login successful, navigating to:",
            `/dashboard/${user.role}`,
          );
          navigate(`/dashboard/${user.role}`);
        } else {
          console.log(
            "Login successful but no user data, navigating to subscriber dashboard",
          );
          navigate("/dashboard/subscriber");
        }
      } else {
        console.error("Login error:", error);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      const { success, error, user } = await signUp(
        data.email,
        data.password,
        data.displayName,
        data.role,
      );

      if (success) {
        console.log("Registration successful");
        // Automatically sign in after registration
        const { success: signInSuccess } = await signIn(
          data.email,
          data.password,
        );

        if (signInSuccess) {
          console.log(
            "Auto login successful after registration, navigating to:",
            `/dashboard/${data.role}`,
          );
          navigate(`/dashboard/${data.role}`);
        } else {
          // If auto-login fails, just switch to login tab
          setTab("login");
          // TODO: Show success message to user
        }
      } else {
        console.error("Registration error:", error);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card border border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          TradeRiser
        </CardTitle>
        <CardDescription className="text-center">
          {tab === "login" ? "Sign in to your account" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="name@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
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
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-8 w-8"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="name@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
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
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="TraderJoe"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        This is how you'll appear to other users
                      </FormDescription>
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
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-8 w-8"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Account Type</FormLabel>
                      <FormControl>
                        <RoleSelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <p>
          {tab === "login" ? (
            <>
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setTab("register")}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setTab("login")}
              >
                Login
              </Button>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;

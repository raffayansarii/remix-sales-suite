import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLoginMutation } from "@/api/auth/authApi";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onSwitchToForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [loginHandler , loginStatus] = useLoginMutation()
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    
    loginHandler({email: data.email, password: data.password}).unwrap().then((res) => {
      // Store token and user in localStorage
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res.user));
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
      });
      navigate("/");
    }).catch((error) => {
      toast({
        title: "Login Failed",
        description: error.data?.message || "An error occurred during login",
        variant: "destructive",
      });
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={loginStatus.isLoading}>
            {loginStatus.isLoading ? (
              "Signing in..."
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};
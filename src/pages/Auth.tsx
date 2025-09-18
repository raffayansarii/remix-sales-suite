import React, { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

type AuthView = "login" | "signup" | "forgot-password";

const Auth = () => {
  const [currentView, setCurrentView] = useState<AuthView>("login");

  const renderAuthForm = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            onSwitchToSignup={() => setCurrentView("signup")}
            onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
          />
        );
      case "signup":
        return (
          <SignupForm
            onSwitchToLogin={() => setCurrentView("login")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordForm
            onBackToLogin={() => setCurrentView("login")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/10 to-primary/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-accent/5 blur-2xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-primary/5 blur-xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-sm bg-background/90 border-2 border-primary/20 rounded-2xl p-2 shadow-2xl relative overflow-hidden">
            {/* Inner border glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-accent/10 p-[1px]">
              <div className="w-full h-full rounded-2xl bg-background/95" />
            </div>
            <div className="relative z-10">
              {renderAuthForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
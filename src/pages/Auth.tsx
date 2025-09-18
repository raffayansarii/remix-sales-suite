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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderAuthForm()}
      </div>
    </div>
  );
};

export default Auth;
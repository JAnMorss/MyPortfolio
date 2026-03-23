import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AuthCard from "../cards/auth-card";
import LoginForm from "../header/LoginForm";

interface PortfolioAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: PortfolioAuthModalProps) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-6 pt-3 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <VisuallyHidden>Admin Login</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>

        <AuthCard 
            title="Admin Login" >
          
          {message ? (
            <p className="text-green-600 text-center text-lg">{message}</p>
          ) : (
            <LoginForm
              onLoginSuccess={(msg) => {
                setMessage(msg ?? "Login successful!");
              }}
            />
          )}
        </AuthCard>
      </DialogContent>
    </Dialog>
  );
}
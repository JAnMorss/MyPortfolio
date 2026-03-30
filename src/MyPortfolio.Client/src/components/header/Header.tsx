import { useState } from "react";
import ThemeToggle from "../ThemeToggle";
import Logo from "./Logo";
import { Lock } from "lucide-react"; 
import { Button } from "../ui/button";
import LoginModal from "../modals/login-modal";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./Navbar";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-[#d0d7de] dark:border-[#21262d] bg-[#f6f8fa] dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-base font-semibold">JAnMors</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isAuthenticated) {
                logout();
                window.location.reload();
              } else {
                setIsLoginOpen(true);
              }
            }}
            className="flex items-center gap-1"
            title={isAuthenticated ? "Logout" : "Admin login"}
          >
            <Lock className="w-4 h-4" />
            {isAuthenticated ? "Logout" : "Admin"}
          </Button>
        </div>
      </div>

      <Navbar />

      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </header>
  );
}
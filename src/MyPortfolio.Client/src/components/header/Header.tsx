import { useState } from "react";
import ThemeToggle from "../ThemeToggle";
import Logo from '../../assets/logo.png';
import { Lock, Download } from "lucide-react"; 
import { Button } from "../ui/button";
import LoginModal from "../modals/login-modal";
import { useAuth } from "@/hooks/auth/useAuth";
import Navbar from "./Navbar";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-[#d0d7de] dark:border-[#21262d] bg-[#f6f8fa] dark:bg-[#161b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="w-12 h-12 bg-white rounded-full shadow-md" />
          <span className="text-base font-semibold">JAnMors</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:flex">
            <div
              className={`text-xs px-3 py-1 rounded-full border backdrop-blur transition
                ${
                  isAuthenticated
                    ? `
                      bg-yellow-100 text-yellow-800 border-yellow-300
                      dark:bg-yellow-500/15 dark:text-yellow-200 dark:border-yellow-500/30
                    `
                    : `
                      bg-green-100 text-green-800 border-green-300
                      dark:bg-green-500/15 dark:text-green-200 dark:border-green-500/30
                    `
                }`}
            >
              {isAuthenticated ? "🔐 Admin Mode" : "🟢 Public Mode"}
            </div>
          </div>

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
            <span className="hidden sm:inline">
              {isAuthenticated ? "Logout" : "Admin"}
            </span>
          </Button>

          <a
            href="John%20Anthony%20Morales%20CV.pdf"
            download
            title="Download Resume"
            aria-label="Download John Anthony Morales Resume PDF"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-transparent text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#161b22] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Resume</span>
          </a>
          
        </div>
      </div>

      <Navbar />

      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </header>
  );
}
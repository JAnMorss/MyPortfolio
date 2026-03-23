import { useState } from "react";
import ThemeToggle from "../ThemeToggle";
import Logo from "./Logo";
import { Navbar } from "./Navbar";
import { Lock } from "lucide-react"; 
import { Button } from "../ui/button";
import LoginModal from "../modals/login-modal";

type Props = {};

export default function Header({}: Props) {
  const [activeSection, setActiveSection] = useState("overview");
  const [isLightMode, setIsLightMode] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
            onClick={() => setIsLoginOpen(true)}
            className="flex items-center gap-1"
            title="Admin login"
          >
            <Lock className="w-4 h-4" />
            Admin
          </Button>
        </div>
      </div>

      <Navbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isLightMode={isLightMode}
      />

      <LoginModal
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
      />
    </header>
  );
}
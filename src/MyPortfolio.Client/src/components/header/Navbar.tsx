"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  GraduationCap,
  Briefcase,
  Award,
  MessageSquare,
  FolderKanban,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const navItems = [
    { path: "/overview", label: "Overview", icon: Home },
    { path: "/skills", label: "Skills", icon: Award, auth: true},
    { path: "/projects", label: "Projects", icon: FolderKanban },
    { path: "/education", label: "Education", icon: GraduationCap },
    { path: "/experience", label: "Experience", icon: Briefcase },
    { path: "/messages", label: "Messages", icon: MessageSquare, auth: true },
  ];

  const filteredNavItems = navItems.filter((item) => !item.auth || isLoggedIn);

  const visibleItems = filteredNavItems.slice(0, 2);
  const hiddenItems = filteredNavItems.slice(2);

  return (
    <nav className="sticky top-0 z-10 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 relative">
          <div className="hidden md:flex items-center gap-2 w-full">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const currentPath = location.pathname === "/" ? "/overview" : location.pathname;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-4 border-b-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-[#fd8c73] text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-[#d0d7de] dark:hover:border-[#30363d]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex md:hidden items-center gap-2 w-full">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3 border-b-2 text-sm font-medium",
                    isActive
                      ? "border-[#fd8c73] text-foreground"
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            <div className="inline-block border-l border-[rgba(61,68,77,0.7)] w-px h-6"></div>

            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-1 px-4 py-3 text-sm text-muted-foreground border-b-2 border-transparent"
              >
                More
                <ChevronDown className="w-4 h-4" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#161b22] border rounded-md shadow-lg z-50">
                  {hiddenItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-[#21262d]",
                          isActive && "text-[#fd8c73]"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
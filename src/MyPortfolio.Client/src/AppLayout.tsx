import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from './components/header/Header';
import SidebarProfile from './components/sidebarProfile/sidebarProfile';
import Footer from "./components/Footer/Footer";
import LoadingPage from "./components/LoadingPage";

export default function AppLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsAppReady(true), 500);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isAppReady) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#212830] dark:text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">  
          <div className="lg:w-74">
            <SidebarProfile />
          </div>

          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
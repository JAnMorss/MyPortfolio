import { Routes, Route } from "react-router-dom";
import Header from './components/header/Header';
import SidebarProfile from './components/sidebarProfile/sidebarProfile';
import OverviewPage from "./pages/OverviewPage";
import EducationsPage from "./pages/EducationsPage";
import MessagesPage from "./pages/MessagesPage";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import ExperiencesPage from "./pages/ExperiencesPage";

function App() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#212830] dark:text-white">
      <Header />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">  
          <div className="lg:w-[296px]">
            <SidebarProfile />
          </div>

          <div className="flex-1">
            <Routes>
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/education" element={<EducationsPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/experience" element={<ExperiencesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
            </Routes>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
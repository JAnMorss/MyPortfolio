import EducationsPage from "@/pages/EducationsPage";
import ExperiencesPage from "@/pages/ExperiencesPage";
import MessagesPage from "@/pages/MessagesPage";
import OverviewPage from "@/pages/OverviewPage";
import ProjectsPage from "@/pages/ProjectsPage";
import SkillsPage from "@/pages/SkillsPage";
import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter([
  { path: "/", element: <OverviewPage /> },
  { path: "/overview", element: <OverviewPage /> },
  { path: "/education", element: <EducationsPage /> },
  { path: "/skills", element: <SkillsPage /> },
  { path: "/experience", element: <ExperiencesPage /> },
  { path: "/projects", element: <ProjectsPage /> },
  { path: "/messages", element: <MessagesPage /> },
]);
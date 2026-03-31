import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../AppLayout";
import OverviewPage from "@/pages/OverviewPage";
import EducationsPage from "@/pages/EducationsPage";
import SkillsPage from "@/pages/SkillsPage";
import ExperiencesPage from "@/pages/ExperiencesPage";
import ProjectsPage from "@/pages/ProjectsPage";
import MessagesPage from "@/pages/MessagesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "overview", element: <OverviewPage /> },
      { path: "education", element: <EducationsPage /> },
      { path: "skills", element: <SkillsPage /> },
      { path: "experience", element: <ExperiencesPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "messages", element: <MessagesPage /> },
    ],
  },
]);
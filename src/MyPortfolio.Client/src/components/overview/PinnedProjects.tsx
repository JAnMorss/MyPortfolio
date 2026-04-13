import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectItem } from "@/schemas/projects/project.schema";
import { timeAgoPH } from "@/utils/timeAgo";
import { useState } from "react";
import LoginModal from "@/components/modals/login-modal";
import PinnedProjectsSkeleton from "../skeletons/PinnedProjectsSkeleton";

interface PinnedProjectsProps {
  projects: ProjectItem[];
  pinnedIds: string[];
  isLoggedIn: boolean;
  onOpenModal: () => void;
  loading?: boolean;
}

export default function PinnedProjects({
  projects,
  pinnedIds,
  isLoggedIn,
  onOpenModal,
  loading
}: PinnedProjectsProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handlePinClick = () => {
    if (isLoggedIn) {
      onOpenModal();
    } else {
      setIsLoginOpen(true);
    }
  };

  if (loading) {
    return <PinnedProjectsSkeleton />;
  }

  const getProjectById = (id: string) => projects.find((p) => p.id === id);
  const pinnedProjects = pinnedIds
    .map(getProjectById)
    .filter((p): p is ProjectItem => !!p);

  return (
    <div className="space-y-6">
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />

      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9]">
          Pinned Projects
        </h2>
        <Button variant="outline" size="sm" onClick={handlePinClick}>
          Customize your project
        </Button>
      </div>

      {pinnedProjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pinned projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pinnedProjects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-[#d0d7de] dark:border-[#30363d] rounded-md
                hover:border-[#0969da] dark:hover:border-[#58a6ff]
                transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
                  <a
                    href={project.link || "#"}
                    target="_blank"
                    className="text-sm font-semibold text-[#0969da] dark:text-[#58a6ff] hover:underline"
                  >
                    {project.title}
                  </a>
                </div>

                <span className="px-2 py-0.5 text-xs rounded-full border border-[#d0d7de] dark:border-[#30363d] text-[#57606a] dark:text-[#8b949e]">
                  Personal Project
                </span>
              </div>

              <p className="text-xs text-[#57606a] dark:text-[#8b949e] mb-3 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {project.techstack.split(",").map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium
                      bg-gray-100 dark:bg-gray-700
                      text-gray-800 dark:text-gray-200
                      hover:bg-gray-200 dark:hover:bg-gray-600
                      transition-colors duration-150"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-[#57606a] dark:text-[#8b949e]">
                <span>Created: {timeAgoPH(project.createdAt)}</span>
                {project.updatedAt && <span>Updated: {timeAgoPH(project.updatedAt)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
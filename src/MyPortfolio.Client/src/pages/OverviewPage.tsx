import { useEffect, useState } from "react";
import { projectApiConnector } from "@/api.connector/project/project.api.connector";
import type { ProjectItem } from "@/schemas/projects/project.schema";
import CustomizePinsModal from "@/components/modals/CustomizePinsModal";
import SkillsSection from "@/components/overview/SkillsSection";
import PinnedProjects from "@/components/overview/PinnedProjects";

export default function OverviewPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("pinnedProjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [openModal, setOpenModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await projectApiConnector.getProjects();
        setProjects(data.items);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    localStorage.setItem("pinnedProjects", JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  return (
    <div className="space-y-6">
        
        <PinnedProjects
            projects={projects}
            pinnedIds={pinnedIds}
            isLoggedIn={isLoggedIn}
            onOpenModal={() => setOpenModal(true)}
        />

        <SkillsSection />

        {isLoggedIn && (
            <CustomizePinsModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                projects={projects}
                pinnedIds={pinnedIds}
                onSave={(ids) => setPinnedIds(ids)}
            />
        )}
    </div>
  );
}
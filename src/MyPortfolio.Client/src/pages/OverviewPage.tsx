import { useEffect, useState } from "react";
import { projectApiConnector } from "@/api.connector/project/project.api.connector";
import { skillApiConnector } from "@/api.connector/skill/skill.api.connector";
import type { ProjectItem } from "@/schemas/projects/project.schema";
import type { SkillItem } from "@/schemas/skills/skill.schema";
import CustomizePinsModal from "@/components/modals/CustomizePinsModal";
import CustomizeSkillPinsModal from "@/components/modals/CustomizeSkillPinsModal";
import SkillsSection from "@/components/overview/SkillsSection";
import PinnedProjects from "@/components/overview/PinnedProjects";
import PinnedSkills from "@/components/overview/PinnedSkills";
import Contact from "@/components/overview/Contact";

export default function OverviewPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("pinnedProjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [pinnedSkillIds, setPinnedSkillIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("pinnedSkills");
    return saved ? JSON.parse(saved) : [];
  });
  const [openModal, setOpenModal] = useState(false);
  const [openSkillModal, setOpenSkillModal] = useState(false);
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
    const fetch = async () => {
      try {
        const data = await skillApiConnector.getSkills();
        setSkills(data.items);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    localStorage.setItem("pinnedProjects", JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  useEffect(() => {
    localStorage.setItem("pinnedSkills", JSON.stringify(pinnedSkillIds));
  }, [pinnedSkillIds]);

  return (
    <div className="space-y-6">

        <PinnedProjects
            projects={projects}
            pinnedIds={pinnedIds}
            isLoggedIn={isLoggedIn}
            onOpenModal={() => setOpenModal(true)}
        />

        <PinnedSkills
            skills={skills}
            pinnedIds={pinnedSkillIds}
            isLoggedIn={isLoggedIn}
            onOpenModal={() => setOpenSkillModal(true)}
        />

        <Contact />

        {isLoggedIn && (
            <>
                <CustomizePinsModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    projects={projects}
                    pinnedIds={pinnedIds}
                    onSave={(ids) => setPinnedIds(ids)}
                />
                <CustomizeSkillPinsModal
                    open={openSkillModal}
                    onClose={() => setOpenSkillModal(false)}
                    skills={skills}
                    pinnedIds={pinnedSkillIds}
                    onSave={(ids) => setPinnedSkillIds(ids)}
                />
            </>
        )}
    </div>
  );
}
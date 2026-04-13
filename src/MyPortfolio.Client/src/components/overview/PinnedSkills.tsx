import { useState } from "react";
import type { SkillItem } from "@/schemas/skills/skill.schema"
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/modals/login-modal";
import PinnedSkillsSkeleton from "../skeletons/PinnedSkillsSkeleton";

interface PinnedSkillsProps {
  skills: SkillItem[];
  pinnedIds: string[];
  isLoggedIn: boolean;
  onOpenModal: () => void;
  loading?: boolean;
}

const levelPercentage: Record<string, number> = {
  Beginner: 33,
  Intermediate: 66,
  Advanced: 100,
};

const levelColorMap: Record<string, string> = {
  Beginner: "bg-[#6f42c1]",
  Intermediate: "bg-[#f66a0a]",
  Advanced: "bg-[#28a745]",
};

export default function PinnedSkills({
  skills,
  pinnedIds,
  isLoggedIn,
  onOpenModal,
  loading,
}: PinnedSkillsProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleCustomizeClick = () => {
    if (isLoggedIn) {
      onOpenModal();
    } else {
      setIsLoginOpen(true);
    }
  };

  if (loading) {
    return <PinnedSkillsSkeleton />;
  }

  const getSkillById = (id: string) => skills.find((s) => s.id === id);
  const pinnedSkills = pinnedIds
    .map(getSkillById)
    .filter((s): s is SkillItem => !!s);

  return (
    <div className="space-y-6">
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />

      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-[#24292f] dark:text-[#c9d1d9]">
          Pinned Skills
        </h2>
        <Button variant="outline" size="sm" onClick={handleCustomizeClick}>
          Customize your skills
        </Button>
      </div>

      {pinnedSkills.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pinned skills yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pinnedSkills.map((skill) => {
            const levelKey = String(skill.level);
            const progressValue = levelPercentage[levelKey] ?? 0;
            const progressColor = levelColorMap[levelKey] ?? "bg-gray-400";

            return (
              <div
                key={skill.id}
                className="p-4 rounded-lg border border-[#d0d7de] dark:border-[#30363d] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-2">
                  <span className="font-semibold text-sm text-[#24292f] dark:text-[#c9d1d9]">
                    {skill.skillName}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

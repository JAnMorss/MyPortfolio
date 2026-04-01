// File: components/skill/SkillsSection.tsx
import { useEffect, useState } from "react";
import type { SkillItem } from "@/schemas/skills/skill.schema";

import { skillApiConnector } from "@/api.connector/skill/skill.api.connector";
import { timeAgoPH } from "@/utils/timeAgo";
 

// GitHub-inspired colors for skill levels
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

export default function SkillsSection() {
  const [skills, setSkills] = useState<SkillItem[]>([]);

  const fetchSkills = async () => {
    try {
      const data = await skillApiConnector.getSkills();
      setSkills(data.items);
    } catch (error) {
      console.error("Failed to fetch skills", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#24292f] dark:text-[#c9d1d9]">
        Skills
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((skill) => {
          const level = skill.level;
          const progressValue = levelPercentage[level] ?? 0;
          const progressColor = levelColorMap[level] ?? "bg-gray-400";

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
                <div className="mb-2">
                    <div className="w-full h-2 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
                        <div
                        className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${progressValue}%` }}
                        />
                    </div>
                </div>
            </div>
          );
        })}
      </div>

      {skills.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No skills found.
        </p>
      )}
    </div>
  );
}
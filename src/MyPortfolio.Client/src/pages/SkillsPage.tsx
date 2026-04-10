import { useEffect, useState } from "react";
import type { SkillItem } from "@/schemas/skills/skill.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { skillApiConnector } from "@/api.connector/skill/skill.api.connector";
import { Edit, Trash2 } from "lucide-react";
import SkillModal from "@/components/modals/SkillModal";
import { timeAgoPH } from "@/utils/timeAgo";
import Pagination from "@/components/common/Pagination";
import { LevelLabel } from "@/schemas/skills/skill.schema";
import { useServerPagination } from "@/hooks/pagination/usePagination";

const levelColorMap: Record<string, string> = {
  Beginner: "text-[#6f42c1]",    
  Intermediate: "text-[#f66a0a]", 
  Advanced: "text-[#28a745]",     
};

export default function SkillsPage() {
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    data: skills,
    currentPage,
    totalPages,
    loading,
    fetchData,
    handlePageChange,
    handleNext,
    handlePrev,
  } = useServerPagination(skillApiConnector.getSkills);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    fetchData(1, search);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await skillApiConnector.deleteSkill(id);
      fetchData(currentPage, search);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <Input
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        {isLoggedIn && (
          <Button
            onClick={() => {
              setSelectedSkill(null);
              setShowModal(true);
            }}
          >
            Add Skill
          </Button>
        )}
      </div>

      <div className="divide-y">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="py-4 flex justify-between items-center hover:bg-muted/50 px-2 rounded"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{skill.skillName}</span>
                <Badge
                  variant="outline"
                  className={`${
                    levelColorMap[LevelLabel[skill.level] || skill.level] ?? "text-gray-500"
                  } border-gray-300 dark:border-gray-600`}
                >
                  {LevelLabel[skill.level] || skill.level}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground mt-1">
                Created: {timeAgoPH(skill.createdAt)}
                {skill.updatedAt && <> • Updated: {timeAgoPH(skill.updatedAt)}</>}
              </div>
            </div>

            {isLoggedIn && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedSkill(skill);
                    setShowModal(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(skill.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}

        {skills.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-10">
            No skills found.
          </p>
        )}

        {loading && (
          <p className="text-center text-muted-foreground py-10">
            Loading...
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {showModal && (
        <SkillModal
          skill={selectedSkill ?? undefined}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchData(currentPage, search);
          }}
        />
      )}
    </div>
  );
}
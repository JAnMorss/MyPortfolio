import { useEffect, useState } from "react";
import type { SkillItem } from "@/schemas/skills/skill.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { skillApiConnector } from "@/api.connector/skill/skill.api.connector";
import { Edit, Trash2 } from "lucide-react";
import SkillModal from "@/components/modals/SkillModal";
import { timeAgoPH } from "@/utils/timeAgo";
import Pagination from "@/components/common/Pagination";
import { LevelLabel } from "@/schemas/skills/skill.schema";
import { useServerPagination } from "@/hooks/pagination/usePagination";
import SkillsSkeleton from "@/components/skeletons/SkillsSkeleton";

const levelColorMap: Record<string, string> = {
  Beginner: "text-[#6f42c1]",
  Intermediate: "text-[#f66a0a]",
  Advanced: "text-[#28a745]",
};

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("skillName");

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
    fetchData(1, search, sortBy);
  }, [search, sortBy]);

  if (loading) {
    return <SkillsSkeleton />;
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await skillApiConnector.deleteSkill(id);
      fetchData(currentPage, search, sortBy);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b pb-3">
        <Input
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-md"
        />

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skillName">Name</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
            </SelectContent>
          </Select>

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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 border border-border rounded-lg hover:bg-muted/50 hover:border-foreground/30 hover:shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {skill.skillName}
                </span>

                <Badge
                  variant="outline"
                  className={`${
                    levelColorMap[
                      LevelLabel[skill.level] || skill.level
                    ] ?? "text-gray-500"
                  } border-gray-300 dark:border-gray-600`}
                >
                  {LevelLabel[skill.level] || skill.level}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground mt-2">
                Created: {timeAgoPH(skill.createdAt)}
                {skill.updatedAt && (
                  <> • Updated: {timeAgoPH(skill.updatedAt)}</>
                )}
              </div>
            </div>

            {isLoggedIn && (
              <div className="flex justify-end gap-2 mt-4">
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
      </div>

      {skills.length === 0 && !loading && (
        <p className="text-center text-muted-foreground py-10">
          No skills found.
        </p>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onNext={() => handleNext(search, sortBy)}
          onPrev={() => handlePrev(search, sortBy)}
        />
      )}

      {showModal && (
        <SkillModal
          skill={selectedSkill ?? undefined}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchData(currentPage, search, sortBy);
          }}
        />
      )}
    </div>
  );
}
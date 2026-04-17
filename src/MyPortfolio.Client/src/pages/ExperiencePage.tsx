import { useEffect, useState } from "react";
import type { ExperienceItem } from "@/schemas/experience/experience.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { experienceApiConnector } from "@/api.connector/experience/experience.api.connector";
import { Edit, Trash2, Briefcase } from "lucide-react";
import ExperienceModal from "@/components/modals/ExperienceModal";
import Pagination from "@/components/common/Pagination";
import { useServerPagination } from "@/hooks/pagination/usePagination";
import ExperienceSkeleton from "@/components/skeletons/ExperienceSkeleton";

export default function ExperiencePage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<ExperienceItem | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    data: experiences,
    currentPage,
    totalPages,
    loading,
    fetchData,
    handlePageChange,
    handleNext,
    handlePrev,
  } = useServerPagination(experienceApiConnector.getExperiences);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    fetchData(1, search, sortBy);
  }, [search, sortBy]);

  if (loading) {
    return <ExperienceSkeleton />;
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;

    try {
      await experienceApiConnector.deleteExperience(id);
      fetchData(currentPage, search, sortBy);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <Input
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startDate">Start Date</SelectItem>
              <SelectItem value="companyName">Company</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
            </SelectContent>
          </Select>

          {isLoggedIn && (
            <Button
              onClick={() => {
                setSelected(null);
                setShowModal(true);
              }}
            >
              Add Experience
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-4 border border-[#d0d7de] dark:border-[#30363d] rounded-md 
            hover:border-[#0969da] dark:hover:border-[#58a6ff]
            transition-colors duration-150"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-[#ddf4ff] dark:bg-[#1c2d41]">
                <Briefcase className="w-5 h-5 text-[#0969da] dark:text-[#58a6ff]" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                      {exp.companyName}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-[#57606a] dark:text-[#8b949e] mt-1">
                      <span>
                        {new Date(exp.startDate).getFullYear()} -{" "}
                        {exp.endDate
                          ? new Date(exp.endDate).getFullYear()
                          : "Present"}
                      </span>
                    </div>
                  </div>

                  {isLoggedIn && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelected(exp);
                          setShowModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-2">
                  {exp.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {experiences.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-10">
            No experiences found.
          </p>
        )}

      </div>

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
        <ExperienceModal
          experience={selected ?? undefined}
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
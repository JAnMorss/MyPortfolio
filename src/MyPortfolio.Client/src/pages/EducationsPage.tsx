import { useEffect, useState } from "react";
import type { EducationItem } from "@/schemas/educations/education.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { educationApiConnector } from "@/api.connector/education/education.api.connector";
import { GraduationCap, Award, Edit, Trash2 } from "lucide-react";
import EducationModal from "@/components/modals/EducationModal";
import Pagination from "@/components/common/Pagination";
import { useServerPagination } from "@/hooks/pagination/usePagination";
import EducationsSkeleton from "@/components/skeletons/EducationsSkeleton";

export default function EducationsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("startDate");

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<EducationItem | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    data: educations,
    currentPage,
    totalPages,
    loading,
    fetchData,
    handlePageChange,
    handleNext,
    handlePrev,
  } = useServerPagination(educationApiConnector.getEducations);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    fetchData(1, search, sortBy);
  }, [search, sortBy]);

  if (loading) {
    return <EducationsSkeleton />;
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this education?")) return;

    try {
      await educationApiConnector.deleteEducation(id);
      fetchData(currentPage, search, sortBy);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-3">
        <Input
          placeholder="Search school..."
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
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="degree">Degree</SelectItem>
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
              Add Education
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="p-4 border border-[#d0d7de] dark:border-[#30363d] rounded-md 
            hover:border-[#0969da] dark:hover:border-[#58a6ff]
            transition-colors duration-150"
          >
            <div className="flex items-start gap-3">
              
              <div className="p-2 rounded bg-[#ddf4ff] dark:bg-[#1c2d41]">
                <GraduationCap className="w-5 h-5 text-[#0969da] dark:text-[#58a6ff]" />
              </div>

              <div className="flex-1">
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                      {edu.degree}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-[#57606a] dark:text-[#8b949e] mt-1">
                      <span className="font-medium">{edu.school}</span>
                      <span>•</span>
                      <span>
                        {new Date(edu.startDate).getFullYear()} -{" "}
                        {edu.endDate
                          ? new Date(edu.endDate).getFullYear()
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
                          setSelected(edu);
                          setShowModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(edu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#57606a] dark:text-[#8b949e] mt-2">
                  {edu.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {educations.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-10">
            No education found.
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

      <div className="mt-8">
        <h3 className="text-base font-semibold mb-4 text-[#24292f] dark:text-[#c9d1d9] flex items-center gap-2">
          <Award className="w-5 h-5" />
          Certifications
        </h3>

        <div className="p-4 border border-dashed rounded-md text-sm text-muted-foreground text-center">
          No certifications added yet.
        </div>
      </div>

      {showModal && (
        <EducationModal
          education={selected ?? undefined}
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
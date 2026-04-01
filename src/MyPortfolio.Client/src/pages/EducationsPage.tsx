import { useEffect, useState } from "react";
import type { EducationItem } from "@/schemas/educations/education.schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { educationApiConnector } from "@/api.connector/education/education.api.connector";

import { GraduationCap, Award, Edit, Trash2 } from "lucide-react";
import EducationModal from "@/components/modals/EducationModal";

export default function EducationsPage() {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [filtered, setFiltered] = useState<EducationItem[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<EducationItem | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const fetchEducations = async () => {
    try {
      const data = await educationApiConnector.getEducations();
      setEducations(data.items);
      setFiltered(data.items);
    } catch (error) {
      console.error("Failed to fetch educations", error);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  useEffect(() => {
    let result = educations;

    if (search) {
      result = result.filter((e) =>
        e.school.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, educations]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this education?")) return;

    try {
      await educationApiConnector.deleteEducation(id);
      fetchEducations();
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

      <div className="space-y-4">
        {filtered.map((edu) => (
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

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No education found.
          </p>
        )}
      </div>

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
            fetchEducations();
          }}
        />
      )}
    </div>
  );
}
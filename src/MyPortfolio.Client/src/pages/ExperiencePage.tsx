import { useEffect, useState } from "react";
import type { ExperienceItem } from "@/schemas/experience/experience.schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { experienceApiConnector } from "@/api.connector/experience/experience.api.connector";

import { Edit, Trash2, Briefcase } from "lucide-react";
import ExperienceModal from "@/components/modals/ExperienceModal";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [filtered, setFiltered] = useState<ExperienceItem[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<ExperienceItem | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await experienceApiConnector.getExperiences();
      setExperiences(data.items);
      setFiltered(data.items);
    } catch (error) {
      console.error("Failed to fetch experiences", error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    let result = experiences;

    if (search) {
      result = result.filter((e) =>
        e.companyName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, experiences]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;

    try {
      await experienceApiConnector.deleteExperience(id);
      fetchExperiences();
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

      <div className="space-y-4">
        {filtered.map((exp) => (
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

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No experiences found.
          </p>
        )}
      </div>

      {showModal && (
        <ExperienceModal
          experience={selected ?? undefined}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchExperiences();
          }}
        />
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import type { ProjectItem } from "@/schemas/projects/project.schema";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { projectApiConnector } from "@/api.connector/project/project.api.connector";
import { BookOpen, Trash2, Edit, Image } from "lucide-react";
import ProjectModal from "@/components/modals/ProjectModal";
import ProjectMediaModal from "@/components/modals/ProjectMediaModal";
import { timeAgoPH } from "@/utils/timeAgo";

export default function ProjectPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [filtered, setFiltered] = useState<ProjectItem[]>([]);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);

  // ✅ MEDIA MODAL STATE
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectApiConnector.getProjects();
      setProjects(data.items);
      setFiltered(data.items);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = projects;

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (language !== "all") {
      result = result.filter((p) =>
        p.techstack.toLowerCase().includes(language.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, language, projects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectApiConnector.deleteProject(id);
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
        <Input
          placeholder="Find a repository..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md h-9 text-sm"
        />

        <div className="flex gap-2">
          <Select onValueChange={(val) => setLanguage(val)}>
            <SelectTrigger className="h-9 w-[140px] text-sm">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="c#">C#</SelectItem>
              <SelectItem value="react">React</SelectItem>
            </SelectContent>
          </Select>

          {isLoggedIn && (
            <Button onClick={() => { setModalProject(null); setShowModal(true); }}>
              Create Project
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y">
        {filtered.map((project) => (
          <div key={project.id} className="py-5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <a href={project.link || "#"} target="_blank" className="text-blue-600 font-semibold text-lg hover:underline">
                  {project.title}
                </a>
                <span className="text-xs border rounded-full px-2 py-0.5 text-muted-foreground">
                  Personal Project
                </span>
              </div>

              <div className="flex items-center gap-2">

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setShowMediaModal(true);
                  }}
                >
                  <Image className="w-4 h-4 mr-1" />
                  Preview
                </Button>

                {isLoggedIn && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setModalProject(project);
                        setShowModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-1 mb-2 max-w-2xl">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-2">
              {project.techstack.split(",").map((tech, index) => (
                <span key={index} className="px-3 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
                  {tech.trim()}
                </span>
              ))}
            </div>

            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Created: {timeAgoPH(project.createdAt)}</span>
              {project.updatedAt && <span>Updated: {timeAgoPH(project.updatedAt)}</span>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProjectModal
          project={modalProject ?? undefined}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchProjects();
          }}
        />
      )}

      {showMediaModal && selectedProjectId && (
        <ProjectMediaModal
          projectId={selectedProjectId}
          onClose={() => setShowMediaModal(false)}
        />
      )}
    </div>
  );
}
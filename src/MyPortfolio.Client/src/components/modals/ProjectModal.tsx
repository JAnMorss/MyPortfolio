import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { projectApiConnector } from "@/api.connector/project/project.api.connector";
import type { ProjectItem } from "@/schemas/projects/project.schema";

interface Props {
  project?: ProjectItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProjectModal({ project, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techstack, setTechstack] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setTechstack(project.techstack);
      setLink(project.link || "");
    } else {
      setTitle("");
      setDescription("");
      setTechstack("");
      setLink("");
    }
  }, [project]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (project) {
        await projectApiConnector.updateProject(project.id, {
          title,
          description,
          techstack,
          link,
        });
      } else {
        await projectApiConnector.createProject({
          title,
          description,
          techstack,
          link,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to submit project", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? "Update Project" : "Create Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Techstack (comma separated)"
            value={techstack}
            onChange={(e) => setTechstack(e.target.value)}
          />
          <Input
            placeholder="https://example.com (GitHub, live site, etc.)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? project
                ? "Updating..."
                : "Creating..."
              : project
              ? "Update"
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
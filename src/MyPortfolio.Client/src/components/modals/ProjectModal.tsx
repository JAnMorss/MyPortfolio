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
import { ProjectInputSchema } from "@/schemas/projects/project.schema";
import type { ValidationError } from "@/schemas/ValidationError/validationError.schema";

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
  const [errors, setErrors] = useState<ValidationError[]>([]);

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
    setErrors([]);
    setLoading(true);

    const payload = {
      title,
      description,
      techstack,
      link,
    };

    const parsed = ProjectInputSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(
        parsed.error.issues.map((err) => ({
          propertyName: err.path[0] ? String(err.path[0]) : "Form",
          errorMessage: err.message,
        }))
      );
      setLoading(false);
      return;
    }

    try {
      if (project) {
        await projectApiConnector.updateProject(project.id, parsed.data);
      } else {
        await projectApiConnector.createProject(parsed.data);
      }
      onSuccess();
    } catch (err: any) {
      if (err?.type === "validation") {
        setErrors(err.data.errors);
      } else {
        setErrors([
          {
            propertyName: "Form",
            errorMessage:
              err?.response?.data?.detail || "Something went wrong.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldErrors = (field: string) =>
    errors.filter((e) => e.propertyName === field);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? "Update Project" : "Create Project"}
          </DialogTitle>
        </DialogHeader>

        {getFieldErrors("Form").map((e, i) => (
          <p key={i} className="text-sm text-red-600 text-center">
            {e.errorMessage}
          </p>
        ))}

        <div className="space-y-2 py-2">
          <div className="space-y-1">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {getFieldErrors("title").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>
          <div className="space-y-1">
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {getFieldErrors("description").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>
          <div className="space-y-1">
            <Input
              placeholder="Techstack (comma separated)"
              value={techstack}
              onChange={(e) => setTechstack(e.target.value)}
            />
            {getFieldErrors("techstack").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>
          <div className="space-y-1">
            <Input
              placeholder="https://example.com (GitHub, live site, etc.)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            {getFieldErrors("link").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>
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
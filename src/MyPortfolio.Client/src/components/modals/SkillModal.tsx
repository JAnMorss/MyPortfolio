import { useEffect, useState } from "react";
import type { SkillItem } from "@/schemas/skills/skill.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { skillApiConnector } from "@/api.connector/skill/skill.api.connector";
import { SkillInputSchema } from "@/schemas/skills/skill.schema";
import type { ValidationError } from "@/schemas/ValidationError/validationError.schema";

type Props = {
  skill?: SkillItem;
  onClose: () => void;
  onSuccess: () => void;
};

export default function SkillModal({ skill, onClose, onSuccess }: Props) {
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState<number>(1);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (skill) {
      setSkillName(skill.skillName);
      setLevel(Number(skill.level));
    }
  }, [skill]);

  const handleSubmit = async () => {
    setErrors([]);
    const payload = {
      skillName,
      level,
    };

    const parsed = SkillInputSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(
        parsed.error.issues.map((err) => ({
          propertyName: err.path[0] ? String(err.path[0]) : "Form",
          errorMessage: err.message,
        }))
      );
      return;
    }

    try {
      if (skill) {
        await skillApiConnector.updateSkill(skill.id, parsed.data);
      } else {
        await skillApiConnector.createSkill(parsed.data);
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
    }
  };

  const getFieldErrors = (field: string) =>
    errors.filter((e) => e.propertyName === field);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {skill ? "Edit Skill" : "Create Skill"}
          </DialogTitle>
        </DialogHeader>

        {getFieldErrors("Form").map((e, i) => (
          <p key={i} className="text-sm text-red-600 text-center">
            {e.errorMessage}
          </p>
        ))}

        <div className="space-y-4">
          <div className="space-y-1">
            <Input
              placeholder="Skill name (e.g. C#, React)"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
            {getFieldErrors("skillName").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>

          <div className="space-y-1">
            <Select
              value={String(level)}
              onValueChange={(val) => setLevel(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Beginner</SelectItem>
                <SelectItem value="1">Intermediate</SelectItem>
                <SelectItem value="2">Advanced</SelectItem>
              </SelectContent>
            </Select>
            {getFieldErrors("level").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {skill ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
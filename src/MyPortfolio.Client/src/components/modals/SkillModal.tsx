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

type Props = {
  skill?: SkillItem;
  onClose: () => void;
  onSuccess: () => void;
};

export default function SkillModal({ skill, onClose, onSuccess }: Props) {
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState<number>(1);

  useEffect(() => {
    if (skill) {
      setSkillName(skill.skillName);
      setLevel(Number(skill.level));
    }
  }, [skill]);

  const handleSubmit = async () => {
    try {
      const payload = {
        skillName,
        level,
      };

      if (skill) {
        await skillApiConnector.updateSkill(skill.id, payload);
      } else {
        await skillApiConnector.createSkill(payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Failed to save skill", error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {skill ? "Edit Skill" : "Create Skill"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Skill name (e.g. C#, React)"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
          />

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
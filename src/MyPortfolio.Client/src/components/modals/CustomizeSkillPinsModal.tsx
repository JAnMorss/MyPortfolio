import { useState } from "react";
import type { SkillItem } from "@/schemas/skills/skill.schema";
import { LevelLabel } from "@/schemas/skills/skill.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";

type Props = {
  open: boolean;
  onClose: () => void;
  skills: SkillItem[];
  pinnedIds: string[];
  onSave: (ids: string[]) => void;
};

export default function CustomizeSkillPinsModal({
  open,
  onClose,
  skills,
  pinnedIds,
  onSave,
}: Props) {
  const [selected, setSelected] = useState<string[]>(pinnedIds);
  const [search, setSearch] = useState("");
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      if (selected.length >= 8) return;
      setSelected([...selected, id]);
    }
  };
  const filtered = skills.filter((s) =>
    s.skillName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit pinned skills</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Select up to 6 skills to pin on your overview.
        </p>

        <Input
          placeholder="Filter skills"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2"
        />

        <p className="text-xs text-muted-foreground mt-2">
          {8 - selected.length} remaining
        </p>

        <div className="max-h-75 overflow-y-auto mt-2 space-y-2">
          {filtered.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-2 rounded hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selected.includes(skill.id)}
                  onCheckedChange={() => toggle(skill.id)}
                />
                <span className="text-sm flex items-center gap-2">
                  {skill.skillName}
                  <span className="text-xs text-muted-foreground">
                    ({LevelLabel[String(skill.level)] ?? "Unknown"})
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={() => {
              onSave(selected);
              onClose();
            }}
          >
            Save skills
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

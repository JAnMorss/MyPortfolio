import { useState } from "react";
import type { ProjectItem } from "@/schemas/projects/project.schema";

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
  projects: ProjectItem[];
  pinnedIds: string[];
  onSave: (ids: string[]) => void;
};

export default function CustomizePinsModal({
  open,
  onClose,
  projects,
  pinnedIds,
  onSave,
}: Props) {
  const [selected, setSelected] = useState<string[]>(pinnedIds);
  const [search, setSearch] = useState("");

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      if (selected.length >= 7) return;
      setSelected([...selected, id]);
    }
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit pinned items</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Select up to 6 projects to pin.
        </p>

        <Input
          placeholder="Filter repositories"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2"
        />

        <p className="text-xs text-muted-foreground mt-2">
          {7 - selected.length} remaining
        </p>

        <div className="max-h-[300px] overflow-y-auto mt-2 space-y-2">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-2 rounded hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selected.includes(project.id)}
                  onCheckedChange={() => toggle(project.id)}
                />
                <span className="text-sm">{project.title}</span>
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
            Save pins
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
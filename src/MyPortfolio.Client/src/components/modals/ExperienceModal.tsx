import { useEffect, useState } from "react";
import type { ExperienceItem } from "@/schemas/experience/experience.schema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { experienceApiConnector } from "@/api.connector/experience/experience.api.connector";

type Props = {
  experience?: ExperienceItem;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ExperienceModal({
  experience,
  onClose,
  onSuccess,
}: Props) {
  const [companyName, setCompanyName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (experience) {
      setCompanyName(experience.companyName);
      setStartDate(experience.startDate.slice(0, 10));
      setEndDate(experience.endDate ? experience.endDate.slice(0, 10) : null);
      setDescription(experience.description);
    }
  }, [experience]);

  const handleSubmit = async () => {
    try {
      const payload = {
        companyName,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        description,
      };

      if (experience) {
        await experienceApiConnector.updateExperience(
          experience.id,
          payload
        );
      } else {
        await experienceApiConnector.createExperience(payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Failed to save experience", error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {experience ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              type="date"
              value={endDate ?? ""}
              onChange={(e) =>
                setEndDate(e.target.value || null)
              }
              placeholder="End Date (optional)"
            />
          </div>

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {experience ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
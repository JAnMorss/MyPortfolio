import { useEffect, useState } from "react";
import type { EducationItem } from "@/schemas/educations/education.schema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { educationApiConnector } from "@/api.connector/education/education.api.connector";

type Props = {
  education?: EducationItem;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EducationModal({
  education,
  onClose,
  onSuccess,
}: Props) {
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (education) {
      setSchool(education.school);
      setDegree(education.degree);
      setStartDate(education.startDate.slice(0, 10));
      setEndDate(education.endDate ? education.endDate.slice(0, 10) : null);
      setDescription(education.description);
    }
  }, [education]);

  const handleSubmit = async () => {
    try {
      const payload = {
        school,
        degree,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        description,
      };

      if (education) {
        await educationApiConnector.updateEducation(education.id, payload);
      } else {
        await educationApiConnector.createEducation(payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Failed to save education", error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {education ? "Edit Education" : "Add Education"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="School"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />

          <Input
            placeholder="Degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
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
              onChange={(e) => setEndDate(e.target.value || null)}
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
              {education ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
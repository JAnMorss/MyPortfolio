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
import { EducationInputSchema } from "@/schemas/educations/education.schema";
import type { ValidationError } from "@/schemas/ValidationError/validationError.schema";

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
  const [errors, setErrors] = useState<ValidationError[]>([]);

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
    setErrors([]);
    const rawPayload = {
      school,
      degree,
      startDate,
      endDate,
      description,
    };

    const parsed = EducationInputSchema.safeParse(rawPayload);

    if (!parsed.success) {
      setErrors(
        parsed.error.issues.map((err) => ({
          propertyName: err.path[0] ? String(err.path[0]) : "Form",
          errorMessage: err.message,
        }))
      );
      return;
    }

    const apiPayload = {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate).toISOString(),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate).toISOString() : null,
    };

    try {
      if (education) {
        await educationApiConnector.updateEducation(education.id, apiPayload);
      } else {
        await educationApiConnector.createEducation(apiPayload);
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
            {education ? "Edit Education" : "Add Education"}
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
              placeholder="School"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
            {getFieldErrors("school").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>

          <div className="space-y-1">
            <Input
              placeholder="Degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
            {getFieldErrors("degree").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="space-y-1 flex-1">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {getFieldErrors("startDate").map((e, i) => (
                <p key={i} className="text-sm text-red-600">
                  {e.errorMessage}
                </p>
              ))}
            </div>

            <div className="space-y-1 flex-1">
              <Input
                type="date"
                value={endDate ?? ""}
                onChange={(e) => setEndDate(e.target.value || null)}
              />
              {getFieldErrors("endDate").map((e, i) => (
                <p key={i} className="text-sm text-red-600">
                  {e.errorMessage}
                </p>
              ))}
            </div>
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
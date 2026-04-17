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
import { ExperienceInputSchema } from "@/schemas/experience/experience.schema";
import type { ValidationError } from "@/schemas/ValidationError/validationError.schema";

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
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (experience) {
      setCompanyName(experience.companyName);
      setStartDate(experience.startDate.slice(0, 10));
      setEndDate(experience.endDate ? experience.endDate.slice(0, 10) : null);
      setDescription(experience.description);
    }
  }, [experience]);

  const handleSubmit = async () => {
    setErrors([]);
    const rawPayload = {
      companyName,
      startDate,
      endDate,
      description,
    };

    const parsed = ExperienceInputSchema.safeParse(rawPayload);

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
      if (experience) {
        await experienceApiConnector.updateExperience(
          experience.id,
          apiPayload
        );
      } else {
        await experienceApiConnector.createExperience(apiPayload);
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
            {experience ? "Edit Experience" : "Add Experience"}
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
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            {getFieldErrors("companyName").map((e, i) => (
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
                onChange={(e) =>
                  setEndDate(e.target.value || null)
                }
                placeholder="End Date (optional)"
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
              {experience ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
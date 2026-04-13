"use client";

import { useState } from "react";
import { Mail, Send, X } from "lucide-react";

import { messageApiConnector } from "@/api.connector/message/message.api.connector";
import {
  MessageInputSchema,
  type MessageInput,
} from "@/schemas/message/message.schema";
import type { ValidationError } from "@/schemas/ValidationError/validationError.schema";

import ContactSkeleton from "@/components/skeletons/ContactSkeleton";

export default function Contact() {
  const [formData, setFormData] = useState<MessageInput>({
    personName: "",
    email: "",
    phoneNumber: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [errors, setErrors] = useState<ValidationError[]>([]);

  const fieldIds = {
    personName: "contact-personName",
    email: "contact-email",
    phoneNumber: "contact-phoneNumber",
    content: "contact-content",
  } as const;

  const getFieldErrors = (field: string) =>
    errors.filter((e) => e.propertyName === field);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const parsed = MessageInputSchema.safeParse(formData);

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
      await messageApiConnector.sendMessage(parsed.data);

      setModal({
        message: "Thank you for your message! I'll get back to you soon.",
        type: "success",
      });

      setFormData({
        personName: "",
        email: "",
        phoneNumber: "",
        content: "",
      });
    } catch (err: any) {
      if (err?.type === "validation") {
        setErrors(err.data.errors);
      } else {
        setModal({
          message:
            "You have already sent a message with this name, email, or contact. Only one submission is allowed per user.",
          type: "error",
        });
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ContactSkeleton />;
  }

  return (
    <div className="space-y-6 relative">
      {modal && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 right-4 z-50 w-80 p-4 rounded-md shadow-lg flex items-start gap-3
                        bg-white border border-gray-300 text-gray-800
                        dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <div
            className={`w-3 h-3 rounded-full mt-1 ${
              modal.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <p className="flex-1 text-sm">{modal.message}</p>
          <button
            type="button"
            onClick={() => setModal(null)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="p-4 border rounded-md flex items-start gap-3">
        <Mail className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h3 className="text-base font-semibold mb-1">Get in touch</h3>
          <p className="text-sm text-muted-foreground">
            Feel free to reach out for collaborations or just a friendly chat.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 border rounded-md space-y-4">
        {getFieldErrors("Form").map((e, i) => (
          <p key={i} className="text-sm text-red-600 text-center">
            {e.errorMessage}
          </p>
        ))}

        <div className="rounded-md border border-dashed border-slate-200 p-4 bg-slate-50 dark:bg-slate-900 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            I usually respond within 24 hours. Please include your timeline and goals so I can reply with the best plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor={fieldIds.personName} className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              id={fieldIds.personName}
              type="text"
              name="personName"
              value={formData.personName}
              onChange={handleChange}
              autoComplete="name"
              aria-invalid={!!getFieldErrors("personName").length}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Your name"
            />
            {getFieldErrors("personName").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>

          <div className="space-y-1">
            <label htmlFor={fieldIds.email} className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              id={fieldIds.email}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={!!getFieldErrors("email").length}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="your.email@example.com"
            />
            {getFieldErrors("email").map((e, i) => (
              <p key={i} className="text-sm text-red-600">
                {e.errorMessage}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor={fieldIds.phoneNumber} className="block text-sm font-semibold mb-2">
            Contact
          </label>
          <input
            id={fieldIds.phoneNumber}
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            autoComplete="tel"
            aria-invalid={!!getFieldErrors("phoneNumber").length}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Your phone number"
          />
          {getFieldErrors("phoneNumber").map((e, i) => (
            <p key={i} className="text-sm text-red-600">
              {e.errorMessage}
            </p>
          ))}
        </div>

        <div className="space-y-1">
          <label htmlFor={fieldIds.content} className="block text-sm font-semibold mb-2">
            Message
          </label>
          <textarea
            id={fieldIds.content}
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            autoComplete="off"
            aria-invalid={!!getFieldErrors("content").length}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Tell me about your project..."
          />
          {getFieldErrors("content").map((e, i) => (
            <p key={i} className="text-sm text-red-600">
              {e.errorMessage}
            </p>
          ))}
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          I respect your privacy — your message is only used to reply and never shared.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {loading ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
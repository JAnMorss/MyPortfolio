"use client";

import { useState } from "react";
import { Mail, Send, X } from "lucide-react";

import { messageApiConnector } from "@/api.connector/message/message.api.connector";
import { MessageInputSchema, type MessageInput } from "@/schemas/message/message.schema";

export default function Contact() {
  const [formData, setFormData] = useState<MessageInput>({
    personName: "",
    email: "",
    phoneNumber: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validData = MessageInputSchema.parse(formData);

      await messageApiConnector.sendMessage(validData);

      setModal({ message: "Thank you for your message! I'll get back to you soon.", type: "success" });

      setFormData({
        personName: "",
        email: "",
        phoneNumber: "",
        content: "",
      });
    } catch (error: any) {
      if (error?.issues) {
        setModal({
          message: "Validation failed: " + error.issues.map((i: any) => i.message).join(", "),
          type: "error",
        });
      } else {
        setModal({ message: "You have already sent a message with this name, email, or contact. Only one submission is allowed per user.", type: "error" });
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Modal */}
      {modal && (
        <div className="fixed top-4 right-4 z-50 w-80 p-4 rounded-md shadow-lg flex items-start gap-3
                        bg-white border border-gray-300 text-gray-800
                        dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
          <div className={`w-3 h-3 rounded-full mt-1 ${modal.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
          <p className="flex-1 text-sm">{modal.message}</p>
          <button onClick={() => setModal(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border rounded-md flex items-start gap-3">
        <Mail className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h3 className="text-base font-semibold mb-1">Get in touch</h3>
          <p className="text-sm text-muted-foreground">
            Feel free to reach out for collaborations or just a friendly chat.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="personName" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="personName"
              name="personName"
              value={formData.personName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-semibold mb-2">
            Contact
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold mb-2">
            Message
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Tell me about your project..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
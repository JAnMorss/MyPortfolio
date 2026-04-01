import { useEffect, useState } from "react";
import type { MessageItem } from "@/schemas/message/message.schema";

import { messageApiConnector } from "@/api.connector/message/message.api.connector";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Trash2 } from "lucide-react";
import { timeAgoPH } from "@/utils/timeAgo";

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [filtered, setFiltered] = useState<MessageItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await messageApiConnector.getMessages();
      setMessages(data.items);
      setFiltered(data.items);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchMessages();
  }, [isLoggedIn]);

  useEffect(() => {
    let result = messages;

    if (search) {
      result = result.filter(
        (m) =>
          m.personName.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, messages]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;

      try {
        await messageApiConnector.deleteMessage(id);
        fetchMessages();
      } catch (error) {
        console.error("Delete failed", error);
      }
    };

    if (!isLoggedIn) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          You must be logged in to view messages.
        </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Messages
        </h1>

        <Input
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-xl overflow-hidden">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className="group flex gap-4 p-4 border-b last:border-none hover:bg-muted/40 hover:shadow-sm hover:-translate-y-[1px] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-medium">
              {msg.personName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {msg.personName}
                </h2>

                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {timeAgoPH(msg.sentAt)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Email:</span>{" "}
                <a
                  href={`mailto:${msg.email}`}
                  className="hover:underline"
                >
                  {msg.email}
                </a>
              </p>

              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Contact:</span>{" "}
                {msg.phoneNumber}
              </p>

              <div className="border-t my-2" />

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {msg.content}
              </p>

              <div className="flex justify-end pt-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(msg.id)}
                  className="opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Messages from your contact form will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
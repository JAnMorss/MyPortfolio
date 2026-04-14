import { useEffect, useState } from "react";
import { messageApiConnector } from "@/api.connector/message/message.api.connector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { timeAgoPH } from "@/utils/timeAgo";
import Pagination from "@/components/common/Pagination";
import { useServerPagination } from "@/hooks/pagination/usePagination";
import MessagesSkeleton from "@/components/skeletons/MessagesSkeleton";

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("sentAt");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    data: messages,
    currentPage,
    totalPages,
    loading,
    fetchData,
    handlePageChange,
    handleNext,
    handlePrev,
  } = useServerPagination(messageApiConnector.getMessages);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData(1, search, sortBy);
    }
  }, [isLoggedIn, search, sortBy]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;

      try {
        await messageApiConnector.deleteMessage(id);
        fetchData(currentPage, search, sortBy);
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

    if (loading) {
    return <MessagesSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Messages
        </h1>

        <div className="flex gap-2">
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sentAt">Sent At</SelectItem>
              <SelectItem value="personName">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="group flex gap-4 p-4 border-b last:border-none hover:bg-muted/40 hover:shadow-sm hover:-translate-y-px transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-medium">
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

        {messages.length === 0 && !loading && (
          <div className="text-center py-16 space-y-2">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Messages from your contact form will appear here.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-16 space-y-2">
            <p className="text-lg font-medium">Loading...</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onNext={() => handleNext(search, sortBy)}
          onPrev={() => handlePrev(search, sortBy)}
        />
      )}
    </div>
  );
}
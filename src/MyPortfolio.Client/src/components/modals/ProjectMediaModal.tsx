"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { projectApiConnector } from "@/api.connector/project/project.api.connector";
import type { ProjectMediaData } from "@/schemas/projects/project.schema";
import { useAuth } from "@/hooks/auth/useAuth";

type ProjectMediaModalProps = {
  projectId: string;
  onClose: () => void;
};

type MediaItem = {
  original: string;
  display: string;
};

export default function ProjectMediaModal({
  projectId,
  onClose,
}: ProjectMediaModalProps) {
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaUrls, setMediaUrls] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data: ProjectMediaData =
        await projectApiConnector.getProjectMedia(projectId);

      const mapped = (data.mediaUrls ?? []).map((url) => ({
        original: url,
        display: url.replace("portfolio-blob-storage", "localhost"),
      }));

      setMediaUrls(mapped);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to load media", err);
      setError("Failed to load media.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [projectId]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await projectApiConnector.addProjectMedia(projectId, file);
      await fetchMedia();
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload media.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteMedia = async (url: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      setIsLoading(true);
      await projectApiConnector.removeProjectMedia(projectId, url);
      await fetchMedia();
    } catch (err) {
      console.error(err);
      setError("Failed to delete media.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % mediaUrls.length
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + mediaUrls.length) % mediaUrls.length
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-md bg-[#21262d] hover:bg-[#30363d] text-white"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-6xl w-full">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Project Media
          </h2>
          <p className="text-sm text-gray-400">
            {mediaUrls.length > 0
              ? `${currentIndex + 1} / ${mediaUrls.length}`
              : ""}
          </p>
        </div>

        {isAuthenticated && (
          <div className="mb-4 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {isUploading ? "Uploading..." : "Add Media"}
            </button>
          </div>
        )}

        {isLoading && (
          <p className="text-white text-center">Loading...</p>
        )}
        {error && (
          <p className="text-red-400 text-center">{error}</p>
        )}

        {!isLoading && mediaUrls.length > 0 && (
          <>
            <div className="relative bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
              <img
                src={mediaUrls[currentIndex].display}
                className="w-full max-h-[70vh] object-contain"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "/placeholder.png")
                }
              />

              {mediaUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}

              {isAuthenticated && (
                <button
                  onClick={() =>
                    handleDeleteMedia(
                      mediaUrls[currentIndex].original
                    )
                  }
                  className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs rounded"
                >
                  Delete
                </button>
              )}
            </div>

            {mediaUrls.length > 1 && (
              <div className="mt-6 flex gap-2 justify-center overflow-x-auto pb-2">
                {mediaUrls.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                      index === currentIndex
                        ? "border-blue-500"
                        : "border-[#30363d] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={item.display}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {!isLoading && mediaUrls.length === 0 && (
          <p className="text-center text-gray-400">
            No media available.
          </p>
        )}
      </div>

      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}
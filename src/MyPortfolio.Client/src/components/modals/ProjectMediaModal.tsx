"use client";

import { useState, useEffect, useRef } from "react";
import { projectApiConnector } from "@/api.connector/project/project.api.connector";
import type { ProjectMediaData } from "@/schemas/projects/project.schema";
import { useAuth } from "@/hooks/auth/useAuth";

type ProjectMediaModalProps = {
  projectId: string;
  onClose: () => void;
};

export default function ProjectMediaModal({
  projectId,
  onClose,
}: ProjectMediaModalProps) {
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: ProjectMediaData = await projectApiConnector.getProjectMedia(projectId);

      // Fix local URL for browser
      const fixedUrls = (data.mediaUrls ?? []).map((url) =>
        url.replace("portfolio-blob-storage", "localhost")
      );

      setMediaUrls(fixedUrls);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await projectApiConnector.addProjectMedia(projectId, file);
      await fetchMedia(); // Refresh media list
    } catch (err) {
      console.error(err);
      setError("Failed to upload media.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (url: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      setIsLoading(true);
      await projectApiConnector.deleteProjectMedia(projectId, [url]);
      await fetchMedia(); // Refresh media list
    } catch (err) {
      console.error(err);
      setError("Failed to delete media.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-[90%] max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4">Project Media</h2>

        {isAuthenticated && (
          <div className="mb-4">
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
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Add Media"}
            </button>
          </div>
        )}

        {isLoading && <p>Loading media...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && mediaUrls.length === 0 && !error && <p>No media available.</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaUrls.map((url, idx) => (
            <div key={idx} className="relative">
              <img
                src={url}
                alt={`Media ${idx + 1}`}
                className="w-full h-40 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
              {isAuthenticated && (
                <button
                  onClick={() => handleDeleteMedia(url)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
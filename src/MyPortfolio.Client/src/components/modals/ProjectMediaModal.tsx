"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { projectApiConnector } from "@/api.connector/project/project.api.connector";
import { useAuth } from "@/hooks/auth/useAuth";

interface Props {
  projectId: string;
  onClose: () => void;
}

export default function ProjectMediaModal({ projectId, onClose }: Props) {
  const { isAuthenticated } = useAuth();

  const [imageSrc, setImageSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchMedia = async () => {
    try {
      const media = await projectApiConnector.getProjectMedia(projectId);
      const src = `data:${media.contentType};base64,${media.imageBytes}`;
      setImageSrc(src);
    } catch (err) {
      console.error("Failed to load media", err);
      setImageSrc("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [projectId]);

  const handleUploadClick = () => {
    if (!isAuthenticated) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await projectApiConnector.updateProjectMedia(projectId, file);
      await fetchMedia();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-7xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 dark:bg-gray-800">
          <DialogTitle className="text-lg font-semibold">
            Project Media
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Upload or update your project preview image
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 flex flex-col items-center gap-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt="Project Media"
              className="w-full max-w-md rounded-lg border cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setZoomed(true)}
            />
          ) : (
            <p className="text-center text-muted-foreground">
              No media available.
            </p>
          )}

          {isAuthenticated && (
            <div className="flex w-full justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Recommended: PNG or JPG, max 5MB
              </p>

              <Button
                variant="secondary"
                onClick={handleUploadClick}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {zoomed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 cursor-zoom-out"
            onClick={() => setZoomed(false)}
          >
            <img
              src={imageSrc}
              alt="Zoomed Project Media"
              className="max-h-full max-w-full rounded-lg shadow-xl animate-fadeIn"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
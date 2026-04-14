"use client";

import { Pencil } from "lucide-react";

type ProfileAvatarProps = {
  avatarUrl?: string;
  isEditMode: boolean;
  onAvatarClick: () => void;
  isUploading: boolean;
};

export default function ProfileAvatar({ avatarUrl, isEditMode, onAvatarClick, isUploading }: ProfileAvatarProps) {
  return (
    <div className="relative w-65 h-65 mx-auto lg:mx-0">
      <img
        src={avatarUrl}
        alt="Profile"
        className="w-full h-full rounded-full border border-gray-300 dark:border-gray-600 object-cover"
      />

      {isEditMode && (
        <button
          onClick={onAvatarClick}
          className="absolute bottom-2 right-2 flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          disabled={isUploading}
        >
          <Pencil className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Edit"}
        </button>
      )}
    </div>
  );
}
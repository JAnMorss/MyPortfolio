"use client";

import { useState, useRef, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Github, Linkedin, Mail } from "lucide-react";
import {
  UpdateUserProfileSchema,
  type UserProfileData,
} from "@/schemas/users/userProfile.schema";
import { userApiConnector } from "@/api.connector/user/user.api.connector";
import { useAuth } from "@/hooks/auth/useAuth";
import LoginModal from "../modals/login-modal";
import EditableField from "./EditableField";
import SocialLink from "./SocialLink";
import ProfileAvatar from "./ProfileAvatar";
import ProfileViews from "./ProfileViews";
import { connection } from "@/lib/signalr";

const USER_ID = "4AB06C35-908E-4697-8A35-5E7546C292D2";

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(" ");

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1] || "",
  };
};

type LocalEditData = {
  firstName: string;
  lastName: string;
  age?: number;
  headLine?: string;
  about?: string;
};

export default function SidebarProfile() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [localData, setLocalData] = useState<LocalEditData>({
    firstName: "",
    lastName: "",
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [views, setViews] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startConnection = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
        }

        connection.on("ReceiveViewCount", (count: number) => {
          if (isMounted) setViews(count);
        });
      } catch (err) {
        console.error(err);
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      connection.off("ReceiveViewCount");
    };
  }, []);

  const handleChange = (
    field: keyof LocalEditData,
    value: string | number
  ) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { data } = useQuery<UserProfileData>({
    queryKey: ["userProfile", USER_ID],
    queryFn: () => userApiConnector.getUserProfileById(USER_ID),
  });

  const { data: avatarUrl } = useQuery<string>({
    queryKey: ["userAvatar", USER_ID],
    queryFn: () => userApiConnector.getUserAvatar(USER_ID),
  });

  const { mutate, isPending: isSaving } = useMutation<
    UserProfileData,
    Error,
    LocalEditData
  >({
    mutationFn: (payload) =>
      userApiConnector.updateUserProfile(
        UpdateUserProfileSchema.parse(payload)
      ),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["userProfile", USER_ID], updatedData);
      setIsEditMode(false);
    },
  });

  const {
    mutate: updateAvatar,
    isPending: isUploading,
  } = useMutation({
    mutationFn: (file: File) =>
      userApiConnector.updateUserAvatar(file),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userAvatar"] }),
  });

  const handleEditClick = () => {
    if (!isAuthenticated) return setIsLoginOpen(true);
    if (!data) return;

    const { fullName, age, headLine, about } = data;
    const { firstName, lastName } = splitName(fullName);

    setLocalData({
      firstName,
      lastName,
      age,
      headLine,
      about: about || "",
    });

    setIsEditMode(true);
  };

  const handleSave = () =>
    mutate(localData, {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: ["userAvatar", USER_ID],
        }),
    });

  const handleCancel = () => setIsEditMode(false);

  const handleAvatarClick = () => {
    if (!isAuthenticated) return setIsLoginOpen(true);
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) updateAvatar(file);
  };

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  const { fullName, email, about } = data;
  const { firstName, lastName } = splitName(fullName);

  return (
    <div className="space-y-4">
      <LoginModal
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
      />

      <ProfileAvatar
        avatarUrl={avatarUrl}
        isEditMode={isEditMode}
        onAvatarClick={handleAvatarClick}
        isUploading={isUploading}
      />

      <div className="space-y-1">
        <div className="flex gap-2 text-2xl">
          <EditableField
            value={isEditMode ? localData.firstName : firstName}
            isEditMode={isEditMode}
            onChange={(val) => handleChange("firstName", val)}
          />

          <EditableField
            value={isEditMode ? localData.lastName : lastName}
            isEditMode={isEditMode}
            onChange={(val) => handleChange("lastName", val)}
          />
        </div>

        <EditableField
          value={isEditMode ? localData.headLine ?? "" : data.headLine || "Full Stack Developer"}
          isEditMode={isEditMode}
          onChange={(val) => handleChange("headLine", val)}
          placeholder="Enter a headline"
          className="text-xl font-light text-[#57606a] dark:text-[#8b949e]"
        />
      </div>

      {isEditMode ? (
        <textarea
          value={localData.about}
          onChange={(e) =>
            handleChange("about", e.target.value)
          }
          className="w-full border rounded px-2 py-1"
          rows={4}
        />
      ) : (
        about && (
          <p className="text-base text-gray-700 dark:text-gray-200">
            {about}
          </p>
        )
      )}

      {isEditMode ? (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleCancel}
            className="px-3 py-1.5 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleEditClick}
          className="w-full px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Edit profile
        </button>
      )}

      <ProfileViews count={views} />

      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <SocialLink
          icon={Linkedin}
          url="https://www.linkedin.com/in/john-anthony-morales-a401b4276/"
          label="in/john-anthony-morales-a401b4276"
        />

        <SocialLink
          icon={Github}
          url="https://github.com/JAnMorss"
          label="github.com/JAnMorss"
        />

        <SocialLink icon={Mail} label={email} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
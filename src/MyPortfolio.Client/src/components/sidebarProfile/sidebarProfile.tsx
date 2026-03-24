"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Github, Linkedin, Mail, Users } from "lucide-react";
import type {
  UserProfileData,
  UpdateUserProfileInput,
} from "@/schemas/users/userProfile.schema";
import { UpdateUserProfileSchema } from "@/schemas/users/userProfile.schema";
import { userApiConnector } from "@/api.connector/user/user.api.connector";
import { useAuth } from "@/hooks/useAuth";
import LoginModal from "../modals/login-modal";

const USER_ID = "4AB06C35-908E-4697-8A35-5E7546C292D2";

type LocalEditData = {
  firstName: string;
  lastName: string;
  age?: number;
  headLine?: string;
  about?: string;
};

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(" ");
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1] || "",
  };
};

function EditableField({
  value,
  isEditMode,
  onChange,
  placeholder,
}: {
  value: string;
  isEditMode: boolean;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return isEditMode ? (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border rounded px-2 py-1 w-full"
    />
  ) : (
    <p>{value}</p>
  );
}

function SocialLink({
  icon: Icon,
  url,
  label,
}: {
  icon: React.ElementType;
  url?: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate"
        >
          {label}
        </a>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
}

export default function SidebarProfile() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [localData, setLocalData] = useState<LocalEditData>({
    firstName: "",
    lastName: "",
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleChange = (field: keyof LocalEditData, value: string | number) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const { data, isLoading, isError, error } = useQuery<UserProfileData, Error>({
    queryKey: ["userProfile", USER_ID],
    queryFn: () => userApiConnector.getUserProfileById(USER_ID),
  });

  const { mutate, isPending: isSaving } = useMutation<
    UserProfileData,
    Error,
    LocalEditData
  >({
    mutationFn: (payload) => {
      const validatedPayload: UpdateUserProfileInput = UpdateUserProfileSchema.parse(payload);
      return userApiConnector.updateUserProfile(validatedPayload);
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["userProfile", USER_ID], updatedData);
      setIsEditMode(false);
    },
    onError: (err: Error) => console.error("Failed to update:", err.message),
  });

  if (isLoading)
    return (
      <div className="p-4 space-y-2 animate-pulse">
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto" />
      </div>
    );

  if (isError || !data)
    return (
      <div className="text-center p-4 text-red-500">
        Failed to load profile.
        {error && <div className="mt-1 text-xs text-red-400">{error.message}</div>}
      </div>
    );

  const { fullName, email, photo, about, age, headLine } = data;
  const { firstName: firstNameFromApi, lastName: lastNameFromApi } = splitName(fullName);

  const handleEditClick = () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    setLocalData({
      firstName: firstNameFromApi,
      lastName: lastNameFromApi,
      age,
      headLine,
      about: about || "",
    });
    setIsEditMode(true);
  };

  const handleSave = () => mutate(localData);
  const handleCancel = () => setIsEditMode(false);

  return (
    <div className="space-y-4">
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />

      <div className="flex justify-center lg:justify-start">
        <img
          src={photo || "https://i.pravatar.cc/260"}
          alt="Profile"
          className="w-[260px] h-[260px] rounded-full border border-gray-300 dark:border-gray-600"
        />
      </div>

      <div className="flex gap-2 text-2xl">
        <EditableField
          value={isEditMode ? localData.firstName : firstNameFromApi}
          isEditMode={isEditMode}
          onChange={(val) => handleChange("firstName", val)}
          placeholder="First Name"
        />
        <EditableField
          value={isEditMode ? localData.lastName : lastNameFromApi}
          isEditMode={isEditMode}
          onChange={(val) => handleChange("lastName", val)}
          placeholder="Last Name"
        />
      </div>

      {isEditMode ? (
        <textarea
          value={localData.about}
          onChange={(e) => handleChange("about", e.target.value)}
          className="w-full border rounded px-2 py-1"
          rows={4}
          placeholder="About"
        />
      ) : (
        about && <p className="text-base text-gray-700 dark:text-gray-200">{about}</p>
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

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Users className="w-4 h-4" />
        <span className="font-semibold text-gray-900 dark:text-gray-100">3</span> People View Your Portfolio
      </div>

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
    </div>
  );
}
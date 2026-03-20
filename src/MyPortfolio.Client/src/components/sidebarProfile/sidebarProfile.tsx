"use client";

import { useQuery } from "@tanstack/react-query";
import { Github, Linkedin, Mail, Users } from "lucide-react";
import type { UserProfileData } from "@/schemas/users/userProfile.schema";
import { publicUserApiConnector } from "@/api.connector/user/user.api.connector";

const USER_ID = "4AB06C35-908E-4697-8A35-5E7546C292D2";

export default function SidebarProfile() {
  const { data, isLoading, isError, error } = useQuery<UserProfileData, Error>({
    queryKey: ["userProfile", USER_ID],
    queryFn: async () => {
      const response = await publicUserApiConnector.getUserProfileById(USER_ID);
      return response.data;
    },
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

  const { fullName, email, photo, about } = data;

  return (
    <div className="space-y-4">
      <div className="flex justify-center lg:justify-start">
        <img
          src={photo || "https://i.pravatar.cc/260"}
          alt="Profile"
          className="w-[260px] h-[260px] rounded-full border border-gray-300 dark:border-gray-600"
        />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{fullName}</h1>
      </div>

      {about && <p className="text-base text-gray-700 dark:text-gray-200">{about}</p>}

      <button className="w-full px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        Edit profile
      </button>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Users className="w-4 h-4" />
        <span className="font-semibold text-gray-900 dark:text-gray-100">3</span> People View Your Portfolio
      </div>

      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Linkedin className="w-4 h-4" />
          <a
            href="https://www.linkedin.com/in/john-anthony-morales-a401b4276/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate"
          >
            in/john-anthony-morales-a401b4276
          </a>
        </div>
        <div className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            <a
                href="https://github.com/JAnMorss"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate"
            >
                github.com/JAnMorss
            </a>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{email}</span>
        </div>
      </div>

    </div>
  );
}
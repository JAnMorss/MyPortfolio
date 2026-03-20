import { userProfileSchema, type UserProfileResponse } from "@/schemas/users/userProfile.schema";
import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";


const PUBLIC_BASE_URL = "http://localhost:8026/api/v1";

const publicApi: AxiosInstance = axios.create({
  baseURL: PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const publicUserApiConnector = {
  getUserProfileById: async (userId: string): Promise<UserProfileResponse> => {
    try {
      const response: AxiosResponse = await publicApi.get(`/user-profile/${userId}`);
      const parsed = userProfileSchema.parse(response.data);
      return parsed;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },
};
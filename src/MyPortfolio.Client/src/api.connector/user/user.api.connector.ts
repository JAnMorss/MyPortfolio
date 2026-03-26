import { UpdateUserProfileSchema, userProfileSchema, type UpdateUserProfileInput, type UserProfileData } from "@/schemas/users/userProfile.schema";
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
  type AxiosResponse,
} from "axios";


const BASE_URL = "http://localhost:8026/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error)
);

export const userApiConnector = {
  getUserProfileById: async (userId: string): Promise<UserProfileData> => {
    const response = await api.get(`/user-profile/${userId}`);
    return userProfileSchema.parse(response.data).data;
  },

  updateUserProfile: async (
    data: UpdateUserProfileInput
  ): Promise<UserProfileData> => {
    const validData = UpdateUserProfileSchema.parse(data);
    const response = await api.patch("/user-profile/details", validData);
    return userProfileSchema.parse(response.data).data;
  },

  updateUserAvatar: async (file: File): Promise<UserProfileData> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.put("/user-profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return userProfileSchema.parse(response.data).data;
  },

};
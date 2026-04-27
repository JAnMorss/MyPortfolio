import { UpdateUserProfileSchema, UserAvatarSchema, userProfileSchema, type UpdateUserProfileInput, type UserProfileData } from "@/schemas/users/userProfile.schema";
import { createApiClient } from "@/api.connector/axios.client";

const api = createApiClient();

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

  getUserAvatar: async (userId: string): Promise<string> => {
    const response = await api.get(`/user-profile/avatar/${userId}`);

    const parsed = UserAvatarSchema.parse(response.data);
    const { imageBytes, contentType } = parsed.data;

    return `data:${contentType};base64,${imageBytes}`;
  },

};
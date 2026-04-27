import {
  messageListSchema,
  messageItemSchema,
  MessageInputSchema,
  type MessageListData,
  type MessageItem,
  type MessageInput,
} from "@/schemas/message/message.schema";

import { createApiClient } from "@/api.connector/axios.client";

const api = createApiClient();

export const messageApiConnector = {
  sendMessage: async (data: MessageInput): Promise<void> => {
    const validData = MessageInputSchema.parse(data);

    await api.post("/message", validData);
  },
  
  getMessages: async (page: number = 1, pageSize: number = 10, search?: string, sortBy?: string): Promise<MessageListData> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const params: any = { page, pageSize };
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    const response = await api.get("/message", { params });

    return messageListSchema.parse(response.data).data;
  },

  getMessageById: async (id: string): Promise<MessageItem> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const response = await api.get(`/message/${id}`);

    return messageItemSchema.parse(response.data.data);
  },

  deleteMessage: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    await api.delete(`/message/${id}`);
  },
};
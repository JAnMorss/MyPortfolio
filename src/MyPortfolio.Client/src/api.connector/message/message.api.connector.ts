import {
  messageListSchema,
  messageItemSchema,
  MessageInputSchema,
  type MessageListData,
  type MessageItem,
  type MessageInput,
} from "@/schemas/message/message.schema";

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

export const messageApiConnector = {
  sendMessage: async (data: MessageInput): Promise<void> => {
    const validData = MessageInputSchema.parse(data);

    await api.post("/message", validData);
  },
  
  getMessages: async (page: number = 1, pageSize: number = 10, search?: string): Promise<MessageListData> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const params: any = { page, pageSize };
    if (search) params.search = search;
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
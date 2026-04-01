import { z } from "zod";

export const messageItemSchema = z.object({
  id: z.string(),
  personName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  content: z.string(),
  sentAt: z.string(),
});

export const messageListSchema = z.object({
  data: z.object({
    items: z.array(messageItemSchema),
    totalCount: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  }),
  message: z.string(),
});

export const MessageInputSchema = z.object({
  personName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  content: z.string().min(1, "Message is required"),
});

export type MessageItem = z.infer<typeof messageItemSchema>;

export type MessageListResponse = z.infer<typeof messageListSchema>;

export type MessageListData = MessageListResponse["data"];

export type MessageInput = z.infer<typeof MessageInputSchema>;
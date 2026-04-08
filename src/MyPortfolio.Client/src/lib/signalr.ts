import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:8026/hubs/portfolio")
  .withAutomaticReconnect()
  .build();
import * as signalR from "@microsoft/signalr";

class ProfileSignalRService {
  private connection: signalR.HubConnection | null = null;

  async connect(userId: string, onViewUpdate: (views: number) => void) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:8026/hubs/profile")
      .withAutomaticReconnect()
      .build();

    await this.connection.start();

    await this.connection.invoke("JoinProfileGroup", userId);

    this.connection.on("ProfileViewed", (views: number) => {
      onViewUpdate(views);
    });
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }
}

export const profileSignalR = new ProfileSignalRService();
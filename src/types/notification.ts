export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

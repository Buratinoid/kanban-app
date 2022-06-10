export interface TaskRequest {
  title: string;
  done: boolean;
  order: number;
  description: string;
  userId: string;
  boardId?: string;
  columnId?: string;
  files?: [];
}

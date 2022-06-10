export class TaskResponse {

  id: string;
  title: string;
  done: boolean;
  order: number;
  description: string;
  userId: string;
  // boardId: string;
  // columnId: string;
  files: []

  constructor(
    id: string = '',
    title: string = '',
    done: boolean = false,
    order: number = 1,
    description: string = '',
    userId: string = '',
    // boardId: string = '',
    // columnId: string = '',
    files: [] = []
  ) {

    this.id = id
    this.title = title
    this.done = done
    this.order = order
    this.description = description
    this.userId = userId
    // this.boardId = boardId
    // this.columnId = columnId
    this.files = files
  }
}

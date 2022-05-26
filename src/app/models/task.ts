export class Task {

    id: string;
    title: string;
    done: boolean;
    order: number;
    description: string;
    userId: string;
    boardId: string;
    columnId: string;

    constructor(id: string,
                title: string,
                done: boolean,
                order: number,
                description: string,
                userId: string,
                boardId: string,
                columnId: string
                ) {
          
        this.id = id
        this.title = title
        this.done = done
        this.order = order
        this.description = description
        this.userId = userId
        this.boardId = boardId
        this.columnId = columnId
    }
}

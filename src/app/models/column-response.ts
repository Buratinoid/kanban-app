import { TaskResponse } from './task-response';
export class ColumnResponse {

    id: string;
    title: string;
    order: number;
    tasks: TaskResponse[];

    constructor(id: string, title: string, order: number, tasks: TaskResponse[]) {
        this.id = id
        this.title = title
        this.order = order
        this.tasks = []
    }
    
}

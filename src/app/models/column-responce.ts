import { TaskResponce } from './task-responce';
export class ColumnResponce {

    id: string;
    title: string;
    order: number;
    tasks: TaskResponce[];

    constructor(id: string, title: string, order: number, tasks: TaskResponce[]) {
        this.id = id
        this.title = title
        this.order = order
        this.tasks = []
    }
    
}

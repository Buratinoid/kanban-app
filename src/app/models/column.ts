import { Task } from './task';
export class Column {

    id: string;
    title: string;
    order: number;
    tasks: Task[];

    constructor(id: string, title: string, order: number, tasks: Task[]) {
        this.id = id
        this.title = title
        this.order = order
        this.tasks = []
    }
    
}

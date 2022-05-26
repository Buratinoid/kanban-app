import { Column } from './column';
export class Board {

    id: string;
    title: string;
    description: string;
    columns: Column[]; 

    constructor(id: string, title: string, description: string, column: Column[]) {
        this.id = id
        this.title = title
        this.description = description
        this.columns = []
    }

}
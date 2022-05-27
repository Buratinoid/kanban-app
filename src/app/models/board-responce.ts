import { ColumnResponce } from './column-responce';
export class BoardResponce {

    id: string;
    title: string;
    description: string;
    columns: ColumnResponce[]; 

    constructor(id: string, title: string, description: string, column: ColumnResponce[]) {
        this.id = id
        this.title = title
        this.description = description
        this.columns = []
    }

}
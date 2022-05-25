export class Column {

    id!: string;
    title: string;
    order: number;

    constructor(title: string, order: number) {
        this.title = title
        this.order = order
    }
    
}

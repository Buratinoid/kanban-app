import {ColumnResponse} from './column-response';

export class BoardResponse {

  id: string;
  title: string;
  description: string;
  columns: ColumnResponse[];

  constructor(
    id: string = '',
    title: string = '',
    description: string = '',
    columns: ColumnResponse[] = []
  ) {
    
    this.id = id;
    this.title = title;
    this.description = description;
    this.columns = columns;
  }
}

import {Cell} from './cell';

export interface Row {
  fieldId: string;
  valId: any;
  cells: Cell[];
  retDataFn: any;
  selected: boolean;
}

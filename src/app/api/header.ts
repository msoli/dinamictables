import {Filter} from './filter';

export interface Header {
  name: string;
  field: string;
  visible: boolean;
  sort: boolean;
  sort_dir: string;
  filter: Filter;
  width: number;
  setWidth: boolean;
}

import { CellStyles } from './cellstyles';

export interface ConfigTable {
  size_page?: number;
  showPagination?: boolean;
  sideServer?: boolean;
  filter?: boolean;
  filterType?: string;
  rowSelection?: string;
  tableAutowidth?: boolean;
  fixedColsWidth?: boolean;
  styles?: CellStyles;


}

// filterType: header | form
// rowSelection: multiple, single
// tableAutowidth: boolean
// fixedColsWidth: boolean | se utiliza solo cuando tableAutowidth = true

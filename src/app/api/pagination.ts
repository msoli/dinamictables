export interface Pagination {
  label_prev: string;
  label_next: string;
  total_records: number;
  current_page: number;
  size_page: number;
  total_pages: number;
  pages?: number[];
  sort_dir: string;
  col_name: string;
  max_items: number;
}

import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, Renderer2, OnDestroy
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ServerPagination} from '../api/server-pagination';
import {SearchDataService} from './search-data.service';
import {Row} from '../api/row';
import {Header} from '../api/header';
import {ConfigTable} from '../api/config-table';
import {Pagination} from '../api/pagination';
import {Search} from '../api/search';
import {ValueUpdated} from '../api/value-updated';
import {DatepickerdtComponent} from '../datepickerdt/datepickerdt.component';
import {ApiParams} from '../api/api-params';
import { DinamicTableService } from './dinamic-table.service';

let counterIdDT = 0;

@Component({
  selector: 'dt-dinamictable',
  templateUrl: './dinamictable.component.html',
  styleUrls: ['./dinamictable.component.scss'],
  providers: [SearchDataService]
})
export class DinamictableComponent implements OnInit, AfterViewInit, OnDestroy {


  @Input() data: any;
  @Input() columns: any;
  @Input() configTable: ConfigTable;

  @Output() pageChange = new EventEmitter<ServerPagination>();
  @Output() tableReady = new EventEmitter<ApiParams>();
  @Output() selectedRow = new EventEmitter<any>();

  @ViewChildren('itemdatepickerdt') listDatePickers !: QueryList<DatepickerdtComponent>;
  @ViewChild('tbodydt', {static: false}) tbodydt !: ElementRef;
  // @ViewChild('dinamictabledt', {static: false}) dinamicTabledDT !: ElementRef;
  // @ViewChild('wrapdinamictable', {static: false}) wrapDinamicTable !: ElementRef;
  @ViewChild('containerdinamictable', {static: false}) containerDinamicTable !: ElementRef;

  existData: Promise<boolean>;


  globalListenersUnlisteners: (() => void)[] = [];

  rows: Row[] = [];
   dataSelected: any = [];
   dataModified: any = [];
  dataOri: any;
  headers: Header[] = [];
  pagination: Pagination;
  serverPagination: ServerPagination;
  searchSubject: Subject<Search> = new Subject();
  changeValueSubject: Subject<ValueUpdated> = new Subject();
  search: Search[] = [];
  actualSearch: Search;
  actualColSortName: string;
  rowsSelected: string[] = [];
  date: Date = new Date();

   apiParams: ApiParams;


   fieldId: string;
   tableWidth = 0;
   defaultContainerWidth = 0;
   wraptableWidth = 0;
   numCols: number;


  get defaultId(): string {
    const value = `tabledt-${counterIdDT++}`;
    Object.defineProperty(this, 'defaultId', {value});
    return value;
  }

  constructor(private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
    private   dinamicTableService: DinamicTableService,
    private    searchDataService: SearchDataService) {
  }

  ngOnInit() {

    this.initConfig();
    this.emitTableReadyApi();
    this.initDinamicTableHeaders();
    this.initDinamicTable();
    setTimeout(() => {
      this.onWindowResize();
    });
    // this.existData = Promise.resolve(true);
  }



  ngAfterViewInit(): void {

    this.startGlobalListeners();
    // setTimeout(() => {
    //   this.onWindowResize();
    // });

    // const table = this.renderer.createElement('table');
    // this.renderer.appendChild( table, this.tbodydt.nativeElement);
    // this.renderer.appendChild(document.body, table);
  }



   initConfig() {

    this.configTable = {
      size_page: ('size_page' in this.configTable) ? this.configTable.size_page : 10,
      showPagination: ('showPagination' in this.configTable) ? this.configTable.showPagination : true,
      sideServer: ('sideServer' in this.configTable) ? this.configTable.sideServer : false,
      rowSelection: ('rowSelection' in this.configTable) ? this.configTable.rowSelection : '',
      filter: ('filter' in this.configTable) ? this.configTable.filter : false,
      tableAutowidth: ('tableAutowidth' in this.configTable) ? this.configTable.tableAutowidth : true,
      fixedColsWidth: ('fixedColsWidth' in this.configTable) ? this.configTable.fixedColsWidth : false,
      styles: ('styles' in this.configTable) ? this.configTable.styles : null,
    };




  }


   initDinamicTableHeaders() {


    this.tableWidth = this.dinamicTableService.calculaWidthTable(this.columns);
    this.numCols = this.dinamicTableService.obtenerNumColumnas(this.columns);
    this.fieldId = this.defaultId;

    this.headers = this.dinamicTableService.procesaDataHeader(this.columns, this.configTable);


   }

   initDinamicTable() {




    if (!this.data) {
      this.data = [];
    }



    this.data = this.dinamicTableService.verifyIfIdExist(this.columns, this.data);

    this.dataOri = [];

    this.data.forEach((item) => {
      this.dataOri.push(Object.assign({}, item));
    });

    this.pagination = this.dinamicTableService.generaPagination(this.data.length, this.configTable.size_page);

    this.serverPagination = {
      size_page: this.pagination.size_page,
      sort_dir: this.pagination.sort_dir,
      current_page: this.pagination.current_page,
      col_name: this.pagination.col_name
    };

    // this.headers = this.dinamicTableService.procesaDataHeader(this.columns, this.configTable);
    this.rows = this.dinamicTableService.procesaDataBody(this.pagination, this.data, this.columns);

    this.searchSubscriber();
    this.changeValueSubscriber();

  }


   apiData() {
    const dataToApi = [];
    this.data.forEach((item) => {
      dataToApi.push(Object.assign({}, item));
    });


    return dataToApi;
  }

  apiSetData(inputData) {

    if (!inputData){
      return;
    }
    this.data = [];

    inputData.forEach((item) => {
      this.data.push(Object.assign({}, item));
    });

    this.initDinamicTable();


  }

   apiSelectedRows() {
    const dataToApi = [];
    this.dataSelected.forEach((item) => {
      delete item.idKeyDt;
      dataToApi.push(Object.assign({}, item));
    });
    return dataToApi;
  }

   apiModifiedRows() {
    const dataToApi = [];
    this.dataModified.forEach((item) => {
      delete item.idKeyDt;
      dataToApi.push(Object.assign({}, item));
    });
    return dataToApi;
  }

  // -------- emits
   emitTableReadyApi() {

    this.apiParams = {
      data: this.apiData.bind(this),
      setData: this.apiSetData.bind(this),
      selectedRows: this.apiSelectedRows.bind(this),
      modifiedRows: this.apiModifiedRows.bind(this)

    };

    this.tableReady.emit(this.apiParams);
  }

   emitPageChange() {

    this.serverPagination.col_name = this.pagination.col_name;
    this.serverPagination.sort_dir = this.pagination.sort_dir;
    this.serverPagination.current_page = this.pagination.current_page;
    this.serverPagination.size_page = this.pagination.size_page;
    this.pageChange.emit(this.serverPagination);
  }



  // -------- events

   onChangeValue(valId, field: string, value: string) {
    this.changeValueSubject.next({ valId, field, value });
    return false;
  }

   onSortPage(colName: string) {

    this.actualColSortName = colName;

    const sortRes = this.searchDataService
      .sort(this.dataOri, this.data, this.search, this.pagination, this.headers, this.actualSearch, this.actualColSortName);

    this.data = sortRes.data;
    this.pagination = sortRes.pagination;
    this.headers = sortRes.headers;
    this.search = sortRes.search;

    this.pagination = this.dinamicTableService.recalculaPagination(this.pagination, this.data.length, this.configTable.size_page);

    this.rows = this.dinamicTableService.procesaDataBody(this.pagination, this.data, this.columns);
    this.emitPageChange();
    this.clearRowsSelected();
    return false;

  }

   onSearchData(valSearch: string, fieldSearch: string, filterType: string) {

    switch (filterType) {

      case 'input':
      case 'select':
      case 'text':
      case 'date':
        this.actualSearch = { field: fieldSearch, value: valSearch };
        this.searchSubject.next(this.actualSearch);
        this.clearRowsSelected();
        break;
    }

  }

   onSelectRow(valId: string) {

    const rowSelection = this.configTable.rowSelection;

    const index = this.rowsSelected.indexOf(valId, 0);

    switch (rowSelection) {

      case 'single':

        if (this.rowsSelected.length > 0) {
          if (index > -1) {
            this.rowsSelected.splice(index, 1);
          } else {
            this.rowsSelected = [];
            // this.selectedRow.emit();
            this.rowsSelected.push(valId);

          }

        } else {
          this.rowsSelected.push(valId);
        }

        break;

      case 'multiple':

        if (this.rowsSelected.length > 0) {
          if (index > -1) {
            this.rowsSelected.splice(index, 1);
          } else {
            this.rowsSelected.push(valId);
          }

        } else {
          this.rowsSelected.push(valId);
        }

    }

    this.dataSelected = [];

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.rows.length; i++) {
      const seleccionado = !!this.rowsSelected.find(item => item === String(this.rows[i].valId));
      this.rows[i].selected = seleccionado;
      if (seleccionado) {
        this.dataSelected.push(this.rows[i].retDataFn.data);
      }
    }

    return false;

  }

   onNextPage() {

    if (this.pagination.current_page + 1 > this.pagination.total_pages) {
      return false;
    }

    this.pagination.current_page++;
    this.rows = this.dinamicTableService.procesaDataBody(this.pagination, this.data, this.columns);
    this.emitPageChange();
    this.clearRowsSelected();
    return false;
  }

   onPrevPage() {

    if (this.pagination.current_page - 1 < 1) {
      return false;
    }

    this.pagination.current_page--;
    this.rows = this.dinamicTableService.procesaDataBody(this.pagination, this.data, this.columns);
    this.emitPageChange();
    this.clearRowsSelected();
    return false;
  }

   onSelectPage(numPage) {
    this.pagination.current_page = numPage;
    this.rows = this.dinamicTableService.procesaDataBody(this.pagination, this.data, this.columns);
    this.emitPageChange();
    this.clearRowsSelected();
    return false;
  }


   onWindowResize() {
    this.defaultContainerWidth = this.containerDinamicTable.nativeElement.offsetWidth;

    if (this.configTable.tableAutowidth && this.tableWidth <= this.defaultContainerWidth) {
      this.tableWidth = this.defaultContainerWidth;
      this.wraptableWidth = this.defaultContainerWidth;

      if (this.configTable.fixedColsWidth) {
        this.headers = this.dinamicTableService.fixedColsWidth(this.headers, this.columns, this.defaultContainerWidth);
      }

    } else if (this.configTable.tableAutowidth && this.tableWidth > this.defaultContainerWidth) {
      this.tableWidth = this.tableWidth = this.dinamicTableService.calculaWidthTable(this.columns);
      this.wraptableWidth = this.tableWidth;

      if (this.configTable.fixedColsWidth) {
        this.headers = this.dinamicTableService.calculateColsWidth(this.headers, this.columns);
      }

    } else if (!this.configTable.tableAutowidth) {
      this.wraptableWidth = this.tableWidth;
    }

  }



  // -------- subscribers

   searchSubscriber() {


    this.searchSubject.pipe(
      debounceTime(200)
    ).subscribe((searchValue: Search) => {

      const searchRes = this.searchDataService
        .search(this.dataOri, this.data, this.search, this.pagination, searchValue);

      this.data = searchRes.data;
      this.search = searchRes.search;

      this.pagination = this.dinamicTableService.recalculaPagination(this.pagination, this.data.length, this.configTable.size_page, 1);
      this.rows = this.dinamicTableService.procesaDataBody(this.pagination, this.data, this.columns);
      this.emitPageChange(); // emit  changes

    });
  }

   changeValueSubscriber() {

    this.changeValueSubject.pipe(
      debounceTime(500)
    ).subscribe((newData) => {



      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i][newData.valId.fieldId] === newData.valId.valId) {
          this.data[i][newData.field] = newData.value;

          let existe = false;

          for (let j = 0; j < this.dataModified.length; j++) {
            if (this.dataModified[j][newData.valId.fieldId] === newData.valId.valId) {
              existe = true;
              break;
            }
          }

          if (!existe) {
            this.dataModified.push(this.data[i]);
          } else {
            for (let t = 0; t < this.dataModified.length; t++) {
              if (this.dataModified[t][newData.valId.fieldId] === newData.valId.valId) {
                this.dataModified[t] = this.data[i];
                break;
              }
            }
          }

          break;
        }
      }

      // copiamos los datos al array original
      for (let i = 0; i < this.dataOri.length; i++) {
        if (this.dataOri[i][newData.valId.fieldId] === newData.valId.valId) {
          this.dataOri[i][newData.field] = newData.value;
          break;
        }
      }


      // this.dataChange.emit(this.data);

    });
  }

  // -------- listener

   startGlobalListeners() {

    this.globalListenersUnlisteners.push(
      this.renderer.listen(this.tbodydt.nativeElement, 'click', (e: Event) => {
        // event for rowSelection
        // @ts-ignore
        const rowId = this.renderer.parentNode(e.target).getAttribute('row-id');
        this.onSelectRow(rowId);
      }),
      this.renderer.listen('window', 'resize', (e: Event) => {
          this.onWindowResize();
      })
    );

  }

   stopGlobalListeners() {
    this.globalListenersUnlisteners.forEach((ul) => ul());
    this.globalListenersUnlisteners = [];
  }

  ngOnDestroy(): void {
    this.stopGlobalListeners();
  }

  // -------- functions

   clearRowsSelected() {
    this.rowsSelected = [];
  }

   stop($event: Event) {

    $event.stopPropagation();
    return false;
  }


}

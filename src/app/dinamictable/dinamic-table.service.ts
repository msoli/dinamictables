import { Injectable } from '@angular/core';
import { Pagination } from '../api/pagination';
import { Header } from '../api/header';
import { ConfigTable } from '../api/config-table';
import * as uuid from 'uuid';
import { Row } from '../api/row';
import { Cell } from '../api/cell';

@Injectable({
  providedIn: 'root',
})
export class DinamicTableService {

  constructor() { }

  obtenerNumColumnas(columns): number{
    let numCols = 0;
    for (let i = 0; i < columns.length; i++) {
      const visibleCol = 'visible' in columns[i] ? columns[i].visible : true;
      if (visibleCol) {
        numCols++;
      }
    }
    return numCols;

  }

  obtenerNumColsDefaultWidth(columns): number{
    let numCols = 0;
    for (let i = 0; i < columns.length; i++) {
      const visibleCol = 'visible' in columns[i] ? columns[i].visible : true;
      // const widthCol = 'width' in columns[i] ? columns[i].width : anchoCol;

      if (visibleCol) {
        numCols++;
      }
    }
    return numCols;

  }


  calculaWidthColumn(columns): number {
    return 100;
  }

  calculaWidthTable(columns): number {

    let widthTable = 0;
    const anchoCol = this.calculaWidthColumn(columns);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < columns.length; i++) {
      const visibleCol = 'visible' in columns[i] ? columns[i].visible : true;
      const widthCol = 'width' in columns[i] ?  columns[i].width ?columns[i].width:  anchoCol: anchoCol;

      if (visibleCol) {
        widthTable += widthCol * 1;
      }
    }

    return widthTable;
  }

  calculaWidthTableLive(headers: Header[]): number {

    let widthTable = 0;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < headers.length; i++) {
      widthTable += headers[i].width * 1;

    }

    console.log(widthTable);
    return widthTable;
  }



  fixedColsWidth(headers: Header[], columns, widthContainer: number) {

    // console.log(widthContainer);

    let widthDefined = 0;
    let numColsAplicar = 0;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < columns.length; i++) {
      const visibleCol = 'visible' in columns[i] ? columns[i].visible : true;
      const widthCol = 'width' in columns[i] ? columns[i].width : null;
      if (visibleCol && widthCol != null) {
        widthDefined += widthCol * 1;
      } else if (visibleCol && widthCol == null) {
        numColsAplicar++;
      }
    }


    const diferencia = widthContainer - widthDefined;
    const anchoCol = this.calculaWidthColumn(columns);
    const extraWitdth = Math.floor(diferencia / numColsAplicar);
    const extraWidthFinalCol = widthContainer - (extraWitdth * numColsAplicar + widthDefined);
    // console.log('defined ' + widthDefined);
    // console.log('diferencia ' + diferencia);
    // console.log('extrawidth ' + extraWitdth);
    //  console.log(extraWitdth * numColsAplicar + widthDefined);
    //  console.log(extraWidthFinalCol);

    let applyExtraFinalCol = false;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < headers.length; i++) {
      if (!headers[i].setWidth) {
        if (!applyExtraFinalCol) {
          headers[i].width = extraWitdth + extraWidthFinalCol;
          applyExtraFinalCol = true;
        } else {
          headers[i].width = extraWitdth;
        }
      }
    }

    return headers;
  }


  calculateColsWidth(headers: Header[], columns) {

    const anchoCol = this.calculaWidthColumn(columns);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < headers.length; i++) {
      if (!headers[i].setWidth) {
        headers[i].width = anchoCol;
      }
    }

    return headers;
  }



  /**
   *
   * @param columns columnas definidas por el usuario
   * @param configTable configuracion general de tabla
   */
  procesaDataHeader(columns, configTable: ConfigTable): Header[] {
    const headers: Header[] = [];

    const anchoCol = this.calculaWidthColumn(columns);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < columns.length; i++) {

      if (!columns[i].field) {
        if (!columns[i].buttondt) {
          continue;
        }
      }

      const visibleCol = 'visible' in columns[i] ? columns[i].visible : true;
      const sortCol = 'sortable' in columns[i] ? columns[i].sortable : false;
      let filterCol = 'filter' in columns[i] ? columns[i].filter : null;
      const nameCol = 'headerName' in columns[i] ? columns[i].headerName : columns[i].field;
      let widthCol = 'width' in columns[i] ? columns[i].width : anchoCol;
      let setWidthCol = 'width' in columns[i] ? true : false;


      if (filterCol != null && (!('type' in filterCol) || !filterCol.type)) {
        filterCol = null;
      }

      if (!widthCol) {
        widthCol = anchoCol;
        setWidthCol = false;
      }

      headers.push({
        name: nameCol, visible: visibleCol,
        sort: sortCol, sort_dir: '', field: columns[i].field,
        filter: filterCol, width: widthCol, setWidth: setWidthCol
      });
    }

    return headers;

  }



  /**
   *
   * @param pagination paginacion
   * @param data  data
   * @param columns columnas definidas por usuario
   */
  procesaDataBody(pagination: Pagination, data, columns): Row[] {

    const rows: Row[] = [];

    let cells: Cell[] = [];

    const initFor = (pagination.current_page * pagination.size_page) - pagination.size_page;

    for (let j = initFor; (j < (pagination.current_page * pagination.size_page)) && j < data.length; j++) {

      const row: Row = {
        fieldId: null,
        cells: [],
        valId: null,
        retDataFn: null,
        selected: false
      };
      cells = [];

      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < columns.length; k++) {

        const visibleCell = 'visible' in columns[k] ? columns[k].visible : true;
        let editableCell = 'editable' in columns[k] ? columns[k].editable : null;
        const fieldidCell = 'fieldid' in columns[k] ? columns[k].fieldid : false;
        const fnvalueCell = 'fnValue' in columns[k] ? columns[k].fnValue : null;
        const buttondtCell = 'buttondt' in columns[k] ? columns[k].buttondt : null;

        const idKeyDtCell = 'idKeyDt' in data[j] ? data[j].idKeyDt : null;


        // se define un field o un button
        if (!columns[k].field) {
          if (buttondtCell == null) {
            continue;
          }
        }

        const fieldC = columns[k].field;

        if (fieldC in data[j]) {


          let valueCell = data[j][fieldC];

          //  hay definido un id
          if (fieldidCell) {
            row.fieldId = columns[k].field;
            row.valId = valueCell;

          } else if (idKeyDtCell != null) {
            // se toma el id autogenerado
            row.fieldId = 'idKeyDt';
            row.valId = idKeyDtCell;
          }

          row.retDataFn = {
            fieldId: row.fieldId,
            valId: row.valId,
            data: data[j]
          };


          // las funciones para mostrar value, no alteran el array original
          if (fnvalueCell != null && fnvalueCell instanceof Function) {
            valueCell = fnvalueCell(row.retDataFn.data);
          } else if (fnvalueCell != null) {
            throw new Error('fnValue attribute does not have a function');
          }


          if (editableCell != null && (!('type' in editableCell) || !editableCell.type)) {
            editableCell = null;
          }

          cells.push({
            field: fieldC,
            value: valueCell,
            buttondt: null,
            raw: false,
            visible: visibleCell,
            editable: editableCell,
            fieldid: fieldidCell
          });

        }


        if (buttondtCell != null) {

          // tslint:disable-next-line:prefer-for-of
          for (let l = 0; l < buttondtCell.length; l++) {
            if (typeof buttondtCell[l].onClick !== 'function') {
              throw new Error('buttondt onClick attribute does not have a function');
            }
            if (!('class' in buttondtCell[l])) {
              buttondtCell[l].class = '';
            }
          }

          cells.push({
            field: null,
            value: null,
            buttondt: buttondtCell,
            raw: false,
            visible: visibleCell,
            editable: false,
            fieldid: false
          });

        }
      }


      row.cells = cells;
      rows.push(row);
    }


    return rows;
  }



  /**
   *
   * Funcion que verifica que exista un id en la data, si no hay le auto genera y agrega una columna id a la data
   *
   * @param columns columnas definidas por el usuario
   * @param data data
   */
  verifyIfIdExist(columns, data) {

    let existId = false;
    if (columns.length === 0) {
      return;
    }

    // tslint:disable-next-line:prefer-for-of
    for (let k = 0; k < columns.length; k++) {
      existId = 'fieldid' in columns[k] ? columns[k].fieldid : false;
      break;
    }

    if (!existId && data.length > 0) {

      existId = 'idKeyDt' in data[0] ? columns[0].idKeyDt : null;

      if (existId == null) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < data.length; j++) {
          data[j].idKeyDt = uuid.v4();
        }
      }
    }
    return data;
  }



  /**
   *
   * @param dataLength data.length
   * @param sizePage configTable.size_page
   */
  generaPagination(dataLength: number, sizePage: number) {

    const pagination: Pagination = {
      label_prev: 'Anterior',
      label_next: 'Siguiente',
      col_name: '',
      sort_dir: '',
      total_pages: 0,
      total_records: null,
      current_page: 1,
      size_page: null,
      pages: [],
      max_items: 7,
    };

    return this.recalculaPagination(pagination, dataLength, sizePage, 1);
  }

  /**
   *
   * @param pagination paginacion obj
   * @param dataLength longuitud de datos
   * @param sizePage registros por pagina
   * @param currenPage pagina actual
   */
  recalculaPagination(pagination: Pagination, dataLength: number, sizePage: number, currenPage?: number) {

    if (currenPage) {
      pagination.current_page = currenPage;
    }

    pagination.total_records = dataLength;
    pagination.size_page = sizePage;

    const totalPages = Math.ceil(pagination.total_records / pagination.size_page);
    pagination.total_pages = totalPages;
    pagination.pages = Array(totalPages);
    return pagination;

  }


}

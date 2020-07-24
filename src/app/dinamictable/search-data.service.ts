import {Search} from '../api/search';
import {Pagination} from '../api/pagination';
import {Header} from '../api/header';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchDataService {

  public search(dataOriginal: any, dataIn: any, searchIn: Search[], paginationIn: Pagination, searchValueIn: Search) {

    let dataFiltered;
    let dataAux = [];
    let searchAux = [];

    if (this.existSearch(searchValueIn, searchIn)) {
      dataFiltered = this.filterData(searchValueIn, dataIn, dataOriginal, searchIn);

      dataAux = dataFiltered.dataOut;
      searchAux = dataFiltered.searchOut;

    } else {

      dataOriginal.forEach((item) => {
        dataAux.push(Object.assign({}, item));
      });

      searchAux = searchIn;

    }

    // con este metodo evitamos que cambie el orden del sort, solo lo ordenamos a como esta definido el ordenamiento
    dataAux = this.sortToState(dataAux, paginationIn);


    return {data: dataAux, search: searchAux};
  }

  public sort(dataOriginal: any, dataIn: any, searchIn: Search[], paginationIn: Pagination, headersIn: Header[],
              searchValueIn: Search, colNameSorted) {

    if (!searchValueIn) {
      searchValueIn = {field: '', value: ''};
    }

    let dataFiltered;
    let dataAux = [];
    let searchAux = [];

    if (this.existSearch(searchValueIn, searchIn)) {
      dataFiltered = this.filterData(searchValueIn, dataIn, dataOriginal, searchIn);

      dataAux = dataFiltered.dataOut;
      searchAux = dataFiltered.searchOut;

    } else {

      dataOriginal.forEach((item) => {
        dataAux.push(Object.assign({}, item));
      });

      searchAux = searchIn;

    }

    let headersAux = [];
    let paginationAux: Pagination;

    dataOriginal = [];
    dataAux.forEach((item) => {
      dataOriginal.push(Object.assign({}, item));
    });


    dataFiltered = this.sortPage(colNameSorted, dataAux, dataOriginal, paginationIn, headersIn);

    dataAux = dataFiltered.dataOut;
    headersAux = dataFiltered.headersOut;
    paginationAux = dataFiltered.paginationOut;


    return {data: dataAux, headers: headersAux, pagination: paginationAux, search: searchAux};
  }

  private existSearch(searchValue: Search, search: Search[]) {

    const existField = search.some(({field}) => field === searchValue.field);

    if (existField) {

      for (let i = 0; i < search.length; i++) {
        if (search[i].field === searchValue.field) {
          search[i].value = searchValue.value;
        }
      }

    } else if (!existField) {
      search.push(searchValue);
    }

    let terms = false;

    for (let i = 0; i < search.length; i++) {
      if (search[i].value) {
        terms = true;
        break;
      }
    }

    return terms;
  }

  private filterData(searchValue: Search, data: any, dataOri: any, search: Search[]) {


    if (!this.existSearch(searchValue, search)) {
      // no hay busqueda
      data = [];
      dataOri.forEach((item) => {
        data.push(Object.assign({}, item));
      });

    } else {

      data = [];
      let dataFilteredAux = [];

      dataOri.forEach((item) => {
        dataFilteredAux.push(Object.assign({}, item));
      });


      for (let i = 0; i < search.length; i++) {

        if (!search[i].value) {
          continue;
        }

        data = dataFilteredAux.filter(
          row => {
            for (const key in row) {
              if (search[i].field === key) {
                return String(row[key]).toLocaleLowerCase().startsWith(search[i].value.toLocaleLowerCase(), 0);
              }
            }
          }
        );

        dataFilteredAux = [];
        data.forEach((item) => {
          dataFilteredAux.push(Object.assign({}, item));
        });
      }
    }

    // console.log(data);

    return {dataOut: data, searchOut: search};

  }

  private sortToState(data, pagination) {

    let sortedArray = [];

    if (pagination.sort_dir === 'asc') {
      sortedArray = this.sortAsc(data, pagination.col_name);
    } else if (pagination.sort_dir === 'desc') {
      sortedArray = this.sortDesc(data, pagination.col_name);
    }

    if (pagination.sort_dir !== '') {
      data = [];
      sortedArray.forEach((item) => {
        data.push(Object.assign({}, item));
      });

    }

    return data;
  }

  private sortPage(colName, data, dataOri, pagination, headers) {

    if (pagination.col_name !== colName) {
      pagination.sort_dir = '';
    }

    if (pagination.sort_dir === '') {
      pagination.sort_dir = 'asc';
    } else if (pagination.sort_dir === 'asc') {
      pagination.sort_dir = 'desc';
    } else if (pagination.sort_dir === 'desc') {
      pagination.sort_dir = '';
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < headers.length; i++) {

      if (headers[i].field === colName) {
        headers[i].sort_dir = pagination.sort_dir;
      } else {
        headers[i].sort_dir = '';
      }

    }

    pagination.col_name = colName;

    let sortedArray = [];

    if (pagination.sort_dir === 'asc') {
      sortedArray = this.sortAsc(data, colName);
    } else if (pagination.sort_dir === 'desc') {
      sortedArray = this.sortDesc(data, colName);
    }

    if (pagination.sort_dir !== '') {
      data = sortedArray;


    } else {

      data = [];
      dataOri.forEach((item) => {
        data.push(Object.assign({}, item));
      });
    }


    return {dataOut: data, headersOut: headers, paginationOut: pagination};
  }

  private sortDesc(data: any, colName: string) {

    return data.sort((obj1, obj2) => {
      if (obj1[colName] > obj2[colName]) {
        return -1;
      }

      if (obj1[colName] < obj2[colName]) {
        return 1;
      }

      return 0;
    });
  }

  private sortAsc(data: any, colName: string) {

    return data.sort((obj1, obj2) => {
      if (obj1[colName] > obj2[colName]) {
        return 1;
      }

      if (obj1[colName] < obj2[colName]) {
        return -1;
      }

      return 0;
    });
  }

}

import { Component, OnInit } from "@angular/core";
import { DummyApiService } from "./dummy-api.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "dinamictables";

  datos: any;
  columnas: any;
  config: any;

  api;

  constructor(private dummyApiService: DummyApiService) {}

  onPageChange(data) {
    console.log(data);
  }

  onDataChange(data) {
    console.log("ok");
    console.log(data);
  }

  ngOnInit(): void {
    this.config = {
      size_page: 20,
      showPagination: true,
      sideServer: false,
      rowSelection: "single",
      filter: true,
      tableAutowidth: true,
      fixedColsWidth: true,
      styles: {
        tdClass: 'cell3'
      }
    };

    // this.datos = [
    //   { id: 1, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Miguel Angel Solís', edad: 2, pais: 'MX', fecha: '2019-08-21' },
    //   { id: 2, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Valeria', edad: 2, pais: 'MX', fecha: '2019-08-21' },
    //   { id: 3, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Valeria', edad: 2, pais: 'MX', fecha: '2019-09-01' },
    //   { id: 4, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'America', edad: 8, pais: 'IN', fecha: '2019-07-23' },
    //   { id: 5, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Rabmon', edad: 9, pais: 'MX', fecha: '2019-11-17' },
    //   { id: 5, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Santiago', edad: 10, pais: 'MX', fecha: '2019-08-21' },
    //   { id: 7, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'riguel', edad: 11, pais: 'EU', fecha: '2019-08-21' },
    //   { id: 8, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Valeria', edad: 12, pais: 'RS', fecha: '2019-08-21' },
    //   { id: 9, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Raamiro', edad: 13, pais: 'MX', fecha: '2019-08-21' },
    //   { id: 10, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Racmon', edad: 14, pais: 'MX', fecha: '2019-08-21' },
    //   { id: 11, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Santiago', edad: 15, pais: 'MX', fecha: '2019-08-21' },
    //   { id: 12, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Miguel', edad: 16, pais: 'EU', fecha: '2019-08-21' },
    //   { id: 13, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Valeria', edad: 17, pais: 'MX', fecha: '2019-08-21' },
    //   { id: 14, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'America', edad: 18, pais: 'IN', fecha: '2019-08-21' },
    //   { id: 15, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Ramon', edad: 19, pais: 'RS', fecha: '2019-08-21' },
    //   { id: 16, Paterno: 'Apellido', consola: 'box', movil: 'Android', mascota: 'Perro', materno: 'Materno', nombre: 'Raquel', edad: 20, pais: 'RS', fecha: '2019-08-21' }
    // ];

    this.columnas = [
      {
        headerName: "ID",
        field: "ID",
        visible: true,
        sortable: true,
        fieldid: true,
        width: "",
      },
      {
        field: "Title",
        headerName: "Title",
        sortable: true,
        visible: true,
        value: "",
        filter: {
          type: "input",
        },
        editable: {
          type: "",
        },
        width: "150",
      }, {
        field: "Description",
        headerName: "Description",
        sortable: true,
        visible: true,
        value: "",
        filter: {
          type: "input",
        },
        editable: {
          type: "",
        },
        width: "400",
      },{
        field: "PageCount",
        headerName: "PageCount",
        sortable: true,
        visible: true,
        value: "",
        filter: {
          type: "input",
        },
        editable: {
          type: "",
        },
        width: "",
      },{
        field: "Excerpt",
        headerName: "Excerpt",
        sortable: true,
        visible: true,
        value: "",
        filter: {
          type: "input",
        },
        editable: {
          type: "",
        },
        width: "600",
      },{
        field: "PublishDate",
        headerName: "PublishDate",
        sortable: true,
        visible: true,
        value: "",
       // fnValue: this.procesaFecha.bind(this),// no se usa cuando editable
        filter: {
          type: "date",
        },
        editable: {
          type: "",
        },
        width: "150",
      },
    ];

    // this.columnas = [
    //   {
    //     headerName: '',
    //     buttondt: [{
    //       label: 'Run',
    //       onClick: this.printDataRow.bind(this),
    //       class: 'btn btn-primary mr-2 btn-sm'
    //     }],
    //     visible: false,
    //     width: '75'
    //   },
    //   {
    //     headerName: '',
    //     buttondt: [{
    //       label: 'Delete',
    //       onClick: this.deleteDataRow.bind(this),
    //       class: 'btn btn-danger btn-sm'
    //     }],
    //     visible: false,
    //     width: '75'
    //   },
    //   {
    //     headerName: '',
    //     buttondt: [{
    //       label: 'Correo',
    //       onClick: this.deleteDataRow.bind(this),
    //       class: 'btn btn-success btn-sm'
    //     }],
    //     visible: false,
    //     width: '75'
    //   },
    //   {
    //     headerName: 'ID',
    //     field: 'id',
    //     visible: true,
    //     sortable: true,
    //     fieldid: true,
    //     width: '60'
    //   },
    //   {
    //     field: 'nombre',
    //     headerName: 'Nombre',
    //     sortable: false,
    //     visible: true,
    //     value: '',
    //     filter: {
    //       type: 'input'
    //     },
    //     editable: {
    //       type: ''
    //     },
    //     width: '250'
    //   },
    //   {
    //     field: 'Paterno',
    //     headerName: 'Paterno',
    //     sortable: false,
    //     visible: true,
    //     value: '',
    //     filter: {
    //       type: 'input'
    //     },
    //     editable: {
    //       type: ''
    //     },
    //   },
    //   {
    //     field: 'materno',
    //     headerName: 'Materno',
    //     sortable: false,
    //     visible: true,
    //     value: '',
    //     filter: {
    //       type: 'input'
    //     },
    //     editable: {
    //       type: ''
    //     },
    //   },
    //   {
    //     field: 'consola',
    //     headerName: 'Consola',
    //     sortable: false,
    //     visible: true,
    //     value: '',
    //     filter: {
    //       type: 'input'
    //     },
    //     editable: {
    //       type: ''
    //     },
    //   },
    //   {
    //     field: 'movil',
    //     headerName: 'Movil',
    //     sortable: false,
    //     visible: false,
    //     value: '',
    //     filter: {
    //       type: 'input'
    //     },
    //     editable: {
    //       type: ''
    //     },
    //   },
    //   {
    //     field: 'mascota',
    //     headerName: 'Mascota',
    //     sortable: false,
    //     visible: false,
    //     value: '',
    //     filter: {
    //       type: 'input'
    //     },
    //     editable: {
    //       type: ''
    //     },
    //   },
    //   {
    //     field: 'edad',
    //     headerName: 'Edad',
    //     fnValue: this.multiplicaEdad.bind(this), // no se usa cuando editable
    //     sortable: true,
    //     filter: {
    //       type: 'input'
    //     },
    //     width: '73'
    //   },
    //    {
    //     field: 'fecha',
    //     headerName: 'Fecha',
    //     filter: {
    //       type: 'date'
    //     },
    //     editable: {
    //       type: 'date'
    //     },
    //     width: '130'
    //   },
    //   {
    //     field: 'pais',
    //     headerName: 'Pais',
    //     // fnValue: this.procesaPais.bind(this),// no se usa cuando editable
    //     sortable: true,
    //     editable: {
    //       type: 'select',
    //       data: this.getPaises()
    //     },
    //     filter: {
    //       type: 'select',
    //       data: this.getPaises()
    //     },
    //   },

    // ];
  }

  printDataRow(e: Event, data) {
    e.stopPropagation();
    alert(data.valId);
    console.log(data);
  }

  deleteDataRow(e: Event, data) {
    e.stopPropagation();
    alert("Delete " + data.valId);
    console.log(data);
  }

  getPaises() {
    return [
      { key: "MX", value: "México" },
      { key: "JP", value: "Japon" },
      { key: "EU", value: "EUA" },
      { key: "IN", value: "India" },
      {
        key: "RS",
        value: "Rusia",
      },
    ];
  }

  procesaPais(data) {
    switch (data.pais) {
      case "MX":
        return "Mexico";
      case "EU":
        return "EUA";
      case "IN":
        return "India";
      case "RS":
        return "Rusia";
    }
  }

  procesaFecha(data: string) {
    // console.log(data);
    // return data;
    return data['PublishDate'].substr(0,10);
  }

  multiplicaEdad(data) {
    return data.edad * 1;
  }

  onTableReady(params) {
    this.api = params;

    this.dummyApiService.getBooks().subscribe((data) => {
      this.api.setData(data);
    });
  }

  getData() {
    console.log(this.api.data());
  }
}

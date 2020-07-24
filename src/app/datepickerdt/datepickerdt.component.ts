import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
  Renderer2,
  QueryList,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { DatepickerselComponent } from '../datepickersel/datepickersel.component';

let counter = 0;

@Component({
  selector: 'dt-datepickerdt',
  templateUrl: './datepickerdt.component.html',
  styleUrls: ['./datepickerdt.component.scss'],
  providers: [DatePipe]
})
export class DatepickerdtComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() dateChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() format = 'yyyy-MM-dd';
  @Input() dateInit;
  @Input() tabindex;
  @ViewChild('fieldsdp', { static: false }) fieldsDp: ElementRef;
  @ViewChild('inputdatepickerdt', { static: false }) inputDatepickerdt: ElementRef;

  dPSelComponentRef: ComponentRef<DatepickerselComponent>;

  private listenerWindowResize: () => void;
  private listenerWindowScroll: () => void;

  fieldId: string;

  dateVal: string;
  isOpen = false;

  numDaysOfMonth: number[];

  day: number;
  month: number;
  year: number;
  yearInit: number;
  yearsArray: number[];

  globalListenersUnlisteners: (() => void)[] = [];

  listMonths = [
    { value: 'ENE', key: 1 },
    { value: 'FEB', key: 2 },
    { value: 'MAR', key: 3 },
    { value: 'ABR', key: 4 },
    { value: 'MAY', key: 5 },
    { value: 'JUN', key: 6 },
    { value: 'JUL', key: 7 },
    { value: 'AGO', key: 8 },
    { value: 'SEP', key: 9 },
    { value: 'OCT', key: 10 },
    { value: 'NOV', key: 11 },
    { value: 'DIC', key: 12 },
  ];


  constructor(private datePipe: DatePipe, private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector) {
  }


  ngAfterViewInit(): void {
    // const table = this.renderer.createElement('table');
    //  this.renderer.appendChild( table, this.tbodydt.nativeElement);
    // setTimeout(() => {
    //  this.renderer.appendChild(document.body, this.fieldsDp.nativeElement);
    // });
  }


  get defaultFieldId(): string {
    // Only evaluate and increment if required
    // con el ID se controla, para evitar hacer referencia  a elementos que no corresponden
    // cuando se tiene varios del mismo tipo en la pagina
    const value = `datepickerdt-${counter++}`;
    Object.defineProperty(this, 'defaultFieldId', { value });

    return value;
  }

  ngOnInit() {

    this.day = Number(this.datePipe.transform(new Date(), 'dd'));
    this.month = Number(this.datePipe.transform(new Date(), 'MM'));
    this.year = Number(this.datePipe.transform(new Date(), 'yyyy'));

    this.yearInit = this.year - 10;
    this.yearsArray = Array(21);

    const numDays = new Date(this.year, this.month, 0).getDate();
    this.numDaysOfMonth = Array(numDays);

    if (this.dateInit) {
      const dateParts = this.dateInit.split('-');
      this.year = Number(dateParts[0]);
      this.month = Number(dateParts[1]);
      this.day = Number(dateParts[2]);
      this.dateVal = this.datePipe.transform(new Date(this.year, this.month - 1, this.day), 'yyyy-MM-dd');
    }

    this.fieldId = this.defaultFieldId;

  }

  openDatepicker() {

    const coordsInput = this.inputDatepickerdt.nativeElement.getBoundingClientRect();


    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DatepickerselComponent);
    const componentRef = componentFactory.create(this.injector);


    this.appRef.attachView(componentRef.hostView);


    const dPSelDomElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.dPSelComponentRef = componentRef;

    // const dtsservice = this.datepickerselService.getInstanceDpSel();

    // if (dtsservice.status === 'C') {
    // const componentRef = dtsservice.ref;
    // this.dPSelComponentRef = componentRef;

    // const dPSelDomElem = dtsservice.dom;

    this.dPSelComponentRef.instance.onDateChanged.subscribe(item => {
      if (item.btnType === 'clear') {
        this.onClearValue(item);
      } else if (item.btnType === 'confirm') {
        this.onConfirmValue(item);
      } else if (item.btnType === 'close') {
        this.onClose(item);
      }
    });

    this.dPSelComponentRef.instance.coordsInput = coordsInput;


    this.renderer.appendChild(document.body, dPSelDomElem);
    // } else {
    // this.dPSelComponentRef.instance.coordsInput = coordsInput;
    // }



    this.startWindowListeners();
  }

  closeDatepicker() {

    this.appRef.detachView(this.dPSelComponentRef.hostView);
    this.dPSelComponentRef.destroy();
    this.stopWindowListeners();
  }


  toggle(event: Event) {
    // event.stopPropagation();
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.openDatepicker();
      this.startGlobalListeners();
    } else {
      this.closeDatepicker();
      this.stopGlobalListeners();
    }
  }


  setFecha() {
    const numDays = new Date(this.year, this.month, 0).getDate();
    this.numDaysOfMonth = Array(numDays);
    // this.dateVal = this.datePipe.transform(new Date(this.year, this.month - 1, this.day), this.format);
    // this.dateChanged.emit(this.dateVal);
  }

  ngOnDestroy(): void {
    this.stopGlobalListeners();
  }


  private onClose(dateChanged: DateChanged) {
    this.isOpen = false;
    this.closeDatepicker();
    this.stopGlobalListeners();
  }

  private onClearValue(dateChanged: DateChanged) {
    this.dateVal = dateChanged.value;
    this.dateChanged.emit(this.dateVal);
    this.isOpen = false;
    this.closeDatepicker();
    this.stopGlobalListeners();
  }

  private onConfirmValue(dateChanged: DateChanged) {
    this.dateVal = dateChanged.value;
    this.dateChanged.emit(this.dateVal);
    this.isOpen = false;
    // this.inputDatepickerdt.nativeElement.focus();
    this.closeDatepicker();
    this.stopGlobalListeners();
  }

  // confirm(e: Event) {
  //   this.dateVal = this.datePipe.transform(new Date(this.year, this.month - 1, this.day), this.format);
  //   this.dateChanged.emit(this.dateVal);
  //   this.isOpen = false;
  //   this.closeDatepicker();
  //   this.stopGlobalListeners();
  //   e.stopPropagation();
  //   return false;
  // }

  // clear(e: Event) {
  //   this.dateVal = null;
  //   this.dateChanged.emit(this.dateVal);
  //   this.isOpen = false;
  //   this.closeDatepicker();
  //   this.stopGlobalListeners();
  //   e.stopPropagation();
  //   return false;
  // }

  close(): void {
    this.isOpen = false;
    this.closeDatepicker();
    this.stopGlobalListeners();
  }




  startGlobalListeners() {
    this.globalListenersUnlisteners.push(
      this.renderer.listen(document, 'keydown', (e: KeyboardEvent) => {
        this.onKeyPress(e);
      }),
      this.renderer.listen(document, 'click', (e: Event) => {
        this.onClick(e);
        e.stopPropagation();
      })
    );

  }

  stopGlobalListeners() {
    this.globalListenersUnlisteners.forEach((ul) => ul());
    this.globalListenersUnlisteners = [];
  }

  startWindowListeners() {
    this.listenerWindowResize = this.renderer.listen('window', 'resize', () => this.onWindowResize());
    this.listenerWindowScroll = this.renderer.listen('window', 'scroll', () => this.onWindowResize());
  }

  stopWindowListeners() {

    this.listenerWindowResize();
    this.listenerWindowScroll();

  }


  onKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case ('Escape'):
      case ('Tab'):
        this.isOpen = false;
        this.closeDatepicker();
        this.stopGlobalListeners();
        break;
    }
  }

  onClick(e: Event) {

    if (!this.isOpen) {
      return false;
    }

    if (!this.inputDatepickerdt) {
      return false;
    }

    if (e.target === this.inputDatepickerdt.nativeElement || this.inputDatepickerdt.nativeElement.contains(e.target as any)) {
      return false;
    }

    if (this.dPSelComponentRef &&
        this.dPSelComponentRef.location.nativeElement !== e.target &&
        !this.dPSelComponentRef.location.nativeElement.contains(e.target as any)) {
      // this.close(); //con el overlay desactivamos esto
    }

    // if (this.fieldsDp &&
    //   this.fieldsDp.nativeElement !== e.target &&
    //   !this.fieldsDp.nativeElement.contains(e.target as any)) {
    //   this.close();
    // }
    return false;
  }


  private onWindowResize() {

    this.dPSelComponentRef.instance.coordsInput = this.inputDatepickerdt.nativeElement.getBoundingClientRect();
    this.dPSelComponentRef.instance.position();


    // se mostrar solo cuando el input este en un campo visible del eje X
    // obtener el ancho de la pantalla
    // si el input esta una parte dentro del campo visible, el datepicker se mueve para quedar completamente
    // visible


  }


  stop($event: Event) {
    $event.stopPropagation();
    return false;
  }
}

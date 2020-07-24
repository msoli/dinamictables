import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output, Renderer2, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'td-datepickersel',
  templateUrl: './datepickersel.component.html',
  styleUrls: ['./datepickersel.component.scss']
})
export class DatepickerselComponent implements OnInit, AfterViewInit {


  @Output() onDateChanged: EventEmitter<DateChanged> = new EventEmitter<DateChanged>();
  @Input() format = 'yyyy-MM-dd';
  @Input() dateInit;
  @Input() tabindex;
  @ViewChild('fieldsdp', { static: false }) fieldsDp: ElementRef;
  @ViewChild('containerfieldsdp', { static: false }) containerFieldsdp: ElementRef;

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

  dateVal: string;
  isOpen = false;

  numDaysOfMonth: number[];

  day: number;
  month: number;
  year: number;
  yearInit: number;
  yearsArray: number[];
  coordsInput;


  constructor(private datePipe: DatePipe, private renderer: Renderer2) { }

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

  }

  position() {
    const widthDpickerSel = 250;

    // console.log('x: ' + this.coordsInput.x + ', y: ' + this.coordsInput.bottom);
    // console.log('w: ' + window.innerWidth + '   h: ' + window.innerHeight);

    const posX = this.coordsInput.x;

    if (this.coordsInput.x > window.innerWidth) {
      this.close();
      console.log('close');
    } else
      if (this.coordsInput.x + widthDpickerSel > window.innerWidth) {
        //posX = window.innerWidth - widthDpickerSel;
        //console.log(posX);
        //this.close();
      }


    if (this.containerFieldsdp != null) {
      this.renderer.setStyle(
        this.containerFieldsdp.nativeElement,
        'left',
        posX + 'px'
      );

      this.renderer.setStyle(
        this.containerFieldsdp.nativeElement,
        'top',
        // (this.coordsInput.bottom + window.scrollY) + 'px' // con overlay desactivamos
        (this.coordsInput.bottom) + 'px'
      );
    }
  }

  ngAfterViewInit(): void {
    this.position();
  }

  stop($event: Event) {
    $event.stopPropagation();
    return false;
  }

  setFecha() {
    const numDays = new Date(this.year, this.month, 0).getDate();
    this.numDaysOfMonth = Array(numDays);
    // this.dateVal = this.datePipe.transform(new Date(this.year, this.month - 1, this.day), this.format);
    // this.dateChanged.emit(this.dateVal);
  }



  clear(e: Event) {
    this.dateVal = null;
    const dtChanged: DateChanged = { btnType: 'clear', value: this.dateVal };
    this.onDateChanged.emit(dtChanged);
    e.stopPropagation();
    return false;
  }


  confirm(e: Event) {
    this.dateVal = this.datePipe.transform(new Date(this.year, this.month - 1, this.day), this.format);
    const dtChanged: DateChanged = { btnType: 'confirm', value: this.dateVal };
    this.onDateChanged.emit(dtChanged);
    e.stopPropagation();
    return false;
  }

  close() {
    const dtChanged: DateChanged = { btnType: 'close', value: this.dateVal };
    this.onDateChanged.emit(dtChanged);
  }

}

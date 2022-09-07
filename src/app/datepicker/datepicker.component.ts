import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {
  // @Input() mode: 'DATE' | 'DATE_TIME' = 'DATE';

  localeString: string = 'en';
  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: Array<any> = [];
  selectedDate: any;
  weekArray: any[][] = [];
  meridiem: string = 'AM';
  meridiemToggle: boolean = false;
  inputHour: any = 12;
  inputMinute: any = 30;
  previousEvent: any;
  currentDay: any;

  //for the input element
  inputClicked: boolean = false;
  dateValue: any;

  constructor() { }

  ngOnInit(): void {
    moment.locale(this.localeString);
    this.navDate = moment();
    this.makeHeader();
    this.makeGrid();
  }

  changeNavMonth(num: number, datePart: string){
    this.navDate.add(num, datePart);
    this.makeGrid();
  }

  makeHeader(){
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day => {
      const dayOfWeek = moment().weekday(day).format('ddd')[0];
      return this.weekDaysHeaderArr.push(dayOfWeek);
    });
  }

  makeGrid(){
    this.gridArr = [];

    const firstDayDate = moment(this.navDate).startOf('month');
    const initialEmptyCells = firstDayDate.weekday();
    const lastDayDate = moment(this.navDate).endOf('month');
    const lastEmptyCells = 6 - lastDayDate.weekday();
    const daysInMonth = this.navDate.daysInMonth();
    const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;

    for(let i = 0; i < arrayLength; i++){
      let obj: any = {};
      if(i < initialEmptyCells || i > initialEmptyCells + daysInMonth -1){
        obj.value = 0;
        obj.available = false;
      } else {
        obj.value = i - initialEmptyCells +1;
        obj.available = this.isAvailable(i - initialEmptyCells +1);
      }
      this.gridArr.push(obj);
    }

    const arrays = [], size = 7;

    while (this.gridArr.length > 0) {
      arrays.push(this.gridArr.splice(0, size));
    }

    this.weekArray = arrays;
  }

  isAvailable(num: number): boolean{
    // if(num === 5){
    //   return false;
    // } else {
    //   return true;
    // }
    return true;
  }

  dateFromNum(num: number, referenceDate: any): any{
    let returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any){
    if(day.available){
      this.currentDay = day;
      this.navDate.set({hours: this.inputHour, minutes: this.inputMinute});
      this.selectedDate = this.dateFromNum(day.value, this.navDate);

      this.selectedDate = moment(this.selectedDate).format("MM/DD/YYYY hh:mm") + ' ' + this.meridiem;
    }
  }

  toggleMeridiem(){
    this.meridiemToggle = !this.meridiemToggle;
    this.meridiem = this.meridiemToggle ? 'AM' : 'PM';
  }

  //for the input element
  toggleDatePicker(){
    this.inputClicked = !this.inputClicked;
  }

  dateValueCheck(){
    this.dateValue = this.selectedDate
    if (this.dateValue){
      return true;
    } else{
      return false;
    }
  }

  handleCancelBtnForDatetime(){
    this.selectedDate = ''
    this.toggleDatePicker();
  }

  handleSetBtnForDatetime(){
    this.navDate.set({hours: this.inputHour, minutes: this.inputMinute});
    this.selectedDate = this.dateFromNum(this.currentDay.value, this.navDate);

    this.selectedDate = moment(this.selectedDate).format("MM/DD/YYYY hh:mm") + ' ' + this.meridiem;

    this.toggleDatePicker();
  }

  dateButtonClicked(dayItem: any, event: any){
    this.selectDay(dayItem);

    if(this.previousEvent){
      this.previousEvent.target.style.backgroundColor = '#fff';
      this.previousEvent.target.style.color = '#000';
    }
    event.target.style.backgroundColor = '#18988d';
    event.target.style.color = '#fff';

    this.previousEvent = event;
  }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DinamictableComponent } from './dinamictable/dinamictable.component';
import { SafePipe } from './safe.pipe';
import { DatepickerdtComponent } from './datepickerdt/datepickerdt.component';
import {FormsModule} from '@angular/forms';
import {NgDatepickerModule} from 'ng2-datepicker';
import { SortPageDirective } from './dinamictable/sort-page.directive';
import { DatepickerselComponent } from './datepickersel/datepickersel.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DinamictableComponent,
    SafePipe,
    DatepickerdtComponent,
    SortPageDirective,
    DatepickerselComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgDatepickerModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DatepickerselComponent]
})
export class AppModule { }

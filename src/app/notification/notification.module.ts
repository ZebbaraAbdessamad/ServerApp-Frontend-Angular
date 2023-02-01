import { NotifierModule } from 'angular-notifier';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [
    CommonModule,
    NotifierModule.withConfig({
      // Custom options in here

    }),
  ],
  exports:[
    NotifierModule,
  ],
})
export class NotificationModule {

}

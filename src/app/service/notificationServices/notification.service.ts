import { ServerNotification } from './../../enum/ServerNotification.enum';
import { NotifierService } from 'angular-notifier';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifierService: NotifierService) { }

  onDefault(message:string):void{
    this.notifierService.notify(ServerNotification.DEFAULT,message);
  }
  onSuccess(message:string):void{
    this.notifierService.notify(ServerNotification.SUCCESS,message);
  }
  onError(message:string):void{
    this.notifierService.notify(ServerNotification.ERROR,message);
  }
  onWarning(message:string):void{
    this.notifierService.notify(ServerNotification.WARNING,message);
  }
  onInfo(message:string):void{
    this.notifierService.notify(ServerNotification.INFO,message);
  }

}

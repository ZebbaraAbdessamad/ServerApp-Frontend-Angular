
import { ServerAction } from './../../interface/ServerAction';
import { Status } from './../../enum/status.enum';
import { Server } from './../../interface/server';
import { DataState } from './../../enum/data-state.enum';
import { ServerService } from './../../service/server.service';
import { CustomResponse } from './../../interface/custom-response';
import { AppState } from './../../interface/app-state';
import {  BehaviorSubject, map, Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerActionTypes } from 'src/app/enum/ServerActionTypes.enum';
import { NotificationService } from 'src/app/service/notificationServices/notification.service';


@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {


  appState$?:Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Tsetstatue=Status;

  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject? = new BehaviorSubject<CustomResponse | null>(null);
  filterStatus$ = this.filterSubject.asObservable();


  private isloading = new BehaviorSubject<boolean>(false);
  isloading$ = this.isloading.asObservable();


  constructor(private serverService:ServerService ,private notifierServer: NotificationService){}


  ngOnInit(): void {
  this.appState$ = this.serverService.servers$
  .pipe(
    map(response =>{
      this.dataSubject?.next(response);
      //-------------------this line means appData:{} keep the resopnse as it was and modify the data exactly the servers (like:@overid)
      return {dataState:DataState.LOADED_STATE  ,appData:{...response ,data:{servers:response.data.servers?.reverse()}}}
    }),
    startWith({dataState:DataState.LOADING_STATE }),
    catchError((error:string)=>{
      this.notifierServer.onError(error);
      return of({dataState:DataState.ERROR_STATE ,error})
    })

  );
  }

  pingServer(ipAddress:string):void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.pingServer$(ipAddress)
    .pipe(
      map(response =>{
        this.notifierServer.onDefault(response.message);
        if (this.dataSubject?.value?.data.servers) {
          let filteredServers = this.dataSubject.value.data.servers.filter(server => server !== undefined);
          let index = filteredServers.findIndex(server => server.id === response.data.server?.id);
          if (index !== -1 && response.data.server) {
            filteredServers[index] = response.data.server;
          }
          this.filterSubject.next('');
        }
        return {dataState:DataState.LOADED_STATE  ,appData: this.dataSubject?.value}
      }),

      startWith({dataState:DataState.LOADED_STATE ,appData: this.dataSubject?.value}),
      catchError((error:string)=>{
        this.notifierServer.onError(error);
        this.filterSubject.next('');
        return of({dataState:DataState.ERROR_STATE ,error})
      })

    );
  }

  OnfilterServers(event:Event):void {
    const status = (event.target as HTMLSelectElement).value as Status;
    if (this.dataSubject?.value) {
      this.appState$ = this.serverService.filterServer(status, this.dataSubject.value)
      .pipe(
        map(response =>{
          this.notifierServer.onDefault(response.message);
          return {dataState:DataState.LOADED_STATE  ,appData: response}
        }),
        startWith({dataState:DataState.LOADED_STATE ,appData: this.dataSubject.value}),
        catchError((error:string)=>{
          this.notifierServer.onError(error);
          return of({dataState:DataState.ERROR_STATE ,error})
        })

      );
    }

  }



  OnSaveServer(serverForm:NgForm):void {
    this.isloading.next(true);
    this.appState$ = this.serverService.saveServer$(serverForm.value as Server)
      .pipe(
      map(response =>{
        this.notifierServer.onSuccess(response.message);
        if (this.dataSubject?.value?.data.servers && response.data.server ) {
          this.dataSubject?.next(
            {...response,data:{servers:[response.data.server,...this.dataSubject.value?.data.servers]}}
          );
        }
        document.getElementById('closeModal')?.click();
        this.isloading.next(false);
        serverForm.resetForm({status:this.Tsetstatue.SERVER_DOWN});
        return {dataState:DataState.LOADED_STATE  ,appData: this.dataSubject?.value}
      }),

      startWith({dataState:DataState.LOADED_STATE ,appData: this.dataSubject?.value}),
      catchError((error:string)=>{
        this.notifierServer.onError(error);
        this.isloading.next(false);
        return of({dataState:DataState.ERROR_STATE ,error})
      })

    );
  }

  onSave(event:ServerAction){
    if(event.type===ServerActionTypes.NEW_SERVER){
      this.OnSaveServer(event.payload);
    }
  }


  OndeleteServer(server:Server):void {
    console.log("remove----------------");
    this.appState$ = this.serverService.deleteServer$(server.id)
    .pipe(
      map(response =>{
        this.notifierServer.onWarning(response.message);
        this.dataSubject?.next(
          {...response,data:{servers:this.dataSubject.value?.data.servers?.filter(s=>s.id !== server.id)}}
        );
        return {dataState:DataState.LOADED_STATE  ,appData: this.dataSubject?.value}
      }),
      startWith({dataState:DataState.LOADED_STATE ,appData: this.dataSubject?.value}),
      catchError((error:string)=>{
        this.notifierServer.onError(error);
        return of({dataState:DataState.ERROR_STATE ,error})
      })

    );
  }


  OnprintReport():void{
    this.notifierServer.onInfo('Report downloaded successfuly');
    //window.print();
    let dataType ='application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect?.outerHTML.replace(/ /g,'%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType +','+tableHtml;
    downloadLink.download = 'servers-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);




  }
}

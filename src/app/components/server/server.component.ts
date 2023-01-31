import { ModalComponent } from './../shared/modal/modal.component';
import { Status } from './../../enum/status.enum';
import { Server } from './../../interface/server';
import { DataState } from './../../enum/data-state.enum';
import { ServerService } from './../../service/server.service';
import { CustomResponse } from './../../interface/custom-response';
import { AppState } from './../../interface/app-state';
import {  BehaviorSubject, map, Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private serverService:ServerService,private modalService: NgbModal){}
  openModal() {
    this.modalService.open(ModalComponent);
  }

  ngOnInit(): void {
  this.appState$ = this.serverService.servers$
  .pipe(
    map(response =>{
      this.dataSubject?.next(response);
      console.log('zebbara',response ,'----------')
      return {dataState:DataState.LOADED_STATE  ,appData:response}
    }),
    startWith({dataState:DataState.LOADING_STATE }),
    catchError((error:string)=>{
      console.log('hello error',error ,'----------')
      return of({dataState:DataState.ERROR_STATE ,error})
    })

  );
  }

  pingServer(ipAddress:string):void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.pingServer$(ipAddress)
    .pipe(
      map(response =>{
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
          return {dataState:DataState.LOADED_STATE  ,appData: response}
        }),
        startWith({dataState:DataState.LOADED_STATE ,appData: this.dataSubject.value}),
        catchError((error:string)=>{
          return of({dataState:DataState.ERROR_STATE ,error})
        })

      );
    }

  }

}

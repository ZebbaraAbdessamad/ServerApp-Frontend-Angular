import { ServerActionTypes } from './../../../enum/ServerActionTypes.enum';
import { NgForm } from '@angular/forms';
import { ServerAction } from './../../../interface/ServerAction';
import { BehaviorSubject } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor() { }
  private isloading = new BehaviorSubject<boolean>(false);

  @Input()  isloading$ = this.isloading.asObservable();

  @Output()  ServerEventEmitter:EventEmitter<ServerAction>=new EventEmitter();
  ngOnInit(): void {
  }

  SaveServer(serverForm:NgForm){
    this.ServerEventEmitter.emit({
      type:ServerActionTypes.NEW_SERVER ,payload:serverForm
    });
  }
}

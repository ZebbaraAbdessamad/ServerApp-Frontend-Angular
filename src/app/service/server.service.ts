import { environment } from 'src/environments/environment';
import { Status } from './../enum/status.enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
private readonly apiUrl = 'http://localhost:8080';
url=environment.host;
constructor(private http:HttpClient ) { }

  //all servers
  servers$ =<Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.url}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //one server
  getServer$ = (SereverId:number) => <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.url}/server/get/${SereverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //store server
  saveServer$ = (server :Server) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.url}/server/save`,server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //ping server
  pingServer$ = (ipAddress:string) => <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.url}/server/ping/${ipAddress}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  //remove server
  deleteServer$ = (SereverId:number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.url}/server/delete/${SereverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

   //filter server

   filterServer(status: Status, response: CustomResponse): Observable<CustomResponse> {
    return new Observable<CustomResponse>(subscribe => {
      console.log(response);
      subscribe.next(
        status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status` } :
        {
          ...response,
          message: response.data.servers!.filter(server => server.statue === status).length > 0 ?
          `Server filtered by ${status === Status.SERVER_UP ? 'SERVER_UP': 'SERVER_DOWN'} status` :
          `No servers of ${status} found `, data: { servers: response.data.servers!.filter(server => server.statue === status) }
        }
      );
    });
  }

  //  filterServer$ = (status:Status , response:CustomResponse) => <Observable<CustomResponse>>
  //  new Observable<CustomResponse>(
  //  suscribe => {
  //   console.log(response);
  //   suscribe.next(
  //     status === Status.ALL ? { ...response,message:`Servers filtered by ${status} status`}:
  //     {
  //       ...response,
  //       message:response.data.servers!
  //       .filter(server => server.statue === status).length > 0 ? `Server filtered by
  //       ${status === Status.SERVER_UP ? 'SERVER_UP':'SERVER_DOWN'} status`:
  //       `No servers of ${status} found `,data:{servers:response.data.servers!
  //       .filter(server => server.statue === status)}
  //     }
  //   )
  //  }
  //  );

  //error exception
  private handleError(error :HttpErrorResponse ):Observable<never>{
    console.log(error )
    return throwError(`An error occurred - Error code : ${error.status}`);
  }
}

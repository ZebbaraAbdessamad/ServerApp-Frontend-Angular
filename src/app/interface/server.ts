import { Status } from './../enum/status.enum';
export interface Server {
  id:number;
  ipAddress:string;
  name :string;
  type:string;
  memory:string;
  imgeUrl:string;
  statue:Status;

}

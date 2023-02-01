import { ServerActionTypes } from './../enum/ServerActionTypes.enum';

export interface ServerAction {
  type:ServerActionTypes,
  payload?:any,
}


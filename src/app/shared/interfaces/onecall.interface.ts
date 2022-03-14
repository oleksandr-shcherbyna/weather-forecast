import { IDaily } from "./daily.interface"
import { IHourly } from "./hourly.interface";
import { ICurrent } from "./current.interface";
import { IAlert } from "./alert.interface";

export interface IOneCall {
    alerts: Array<IAlert>;
    current: ICurrent;
    daily: Array<IDaily>;
    hourly: Array<IHourly>;
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
}
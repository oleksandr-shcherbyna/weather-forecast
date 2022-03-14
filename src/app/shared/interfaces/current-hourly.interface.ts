import { IWeather } from "./weather.interface";

export interface ICurrentHourly {
    time: string;
    temp: number | string;
    weather: IWeather;
    iconName: string;
}
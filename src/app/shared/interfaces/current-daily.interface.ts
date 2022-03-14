import { ITempPoints } from "./temp-points.interface";
import { IWeather } from "./weather.interface";

export interface ICurrentDaily {
    date: Array<string>;
    tempPoints: ITempPoints;
    weather: IWeather;
    iconName: string;
}
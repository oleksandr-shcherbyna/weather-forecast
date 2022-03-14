import { IWeather } from "./weather.interface";

export interface IHourly {
    clouds: number;
    dew_point: number;
    dt: number;
    feels_like: number;
    humidity: number;
    pop: number;
    pressure: number;
    temp: number;
    uvi: number;
    visibility: number;
    weather: Array<IWeather>;
    wind_deg: number;
    wind_gust?: number;
    wind_speed: number;
    snow?: object;
    rain?: object;
}
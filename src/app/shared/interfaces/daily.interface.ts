import { ITempPoints } from "./temp-points.interface";
import { IWeather } from "./weather.interface";

export interface IDaily {
    clouds: number;
    dew_point: number;
    dt: number;
    feels_like: object;
    humidity: number;
    moon_phase: number;
    moonrise: number;
    moonset: number;
    pop: number;
    pressure: number;
    sunrise: number;
    sunset: number;
    temp: ITempPoints;
    uvi: number;
    weather: Array<IWeather>;
    wind_deg: number;
    wind_gust?: number;
    wind_speed: number;
    snow?: object;
    rain?: object;
}
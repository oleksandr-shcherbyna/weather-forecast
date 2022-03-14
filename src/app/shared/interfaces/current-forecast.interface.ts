import { IWeather } from "./weather.interface";

export interface ICurrentForecast {
    coord: {
        lon: number;
        lat: number;
      };
      weather: Array<IWeather>;
      base: string;
      main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
      };
      visibility: number;
      wind: {
        speed: number;
        deg: number;
      };
      clouds: {
        all: number;
      };
      dt: number;
      sys: {
        type: number;
        id: number;
        message: string | number;
        country: string;
        sunrise: number;
        sunset: number;
      };
      timezone: number;
      id: number;
      name: string;
      cod: number;
      city?: string;
      iconName?: string;
      currentDateTime?: string;
}
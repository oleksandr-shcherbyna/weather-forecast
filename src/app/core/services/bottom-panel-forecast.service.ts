import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

import { DataService } from './data.service';
import { ICurrentForecast } from 'src/app/shared/interfaces/current-forecast.interface';
import { ITimes } from 'src/app/shared/interfaces/times.interface';
import { IOneCall } from 'src/app/shared/interfaces/onecall.interface';
import { IChart } from 'src/app/shared/interfaces/chart.interface';
import * as forecastConstants from '../../shared/constants/constants';

@Injectable({
  providedIn: 'root'
})

export class BottomPanelForecastService {
  chart = new BehaviorSubject<IChart>(forecastConstants.chart);
  currentChartData = this.chart.asObservable();

  chartLoading = new BehaviorSubject<boolean>(false);
  chartLoaded = this.chartLoading.asObservable();

  constructor(private dataService: DataService, private http: HttpClient) { }

  getHourlyForecast(userCity: string): void {
    this.dataService.isLoadingBottomPanel.next(true);
    this.http.get<ICurrentForecast>(`https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(currForecast => {
      const times: ITimes = this.dataService.getTime(currForecast.timezone, currForecast.sys.sunrise, currForecast.sys.sunset);
      this.http.get<IOneCall>(`https://api.openweathermap.org/data/2.5/onecall?lat=${currForecast.coord.lat}&lon=${currForecast.coord.lon}&exclude=minutely&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(
        bottomPanelData => {
          this.dataService.passCurrentHourlyForecast(bottomPanelData.hourly, times.sunrise, times.sunset);
          this.dataService.isLoadingBottomPanel.next(false);
        }
      );
    });
  }

  getDailyForecast(userCity: string): void {
    this.dataService.isLoadingBottomPanel.next(true);
    this.http.get<ICurrentForecast>(`https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(currForecast => {
      this.http.get<IOneCall>(`https://api.openweathermap.org/data/2.5/onecall?lat=${currForecast.coord.lat}&lon=${currForecast.coord.lon}&exclude=minutely&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(
        bottomPanelData => {
          this.dataService.passCurrentDailyForecast(bottomPanelData.daily, null, null);
          this.dataService.isLoadingBottomPanel.next(false);
        }
      );
    });
  }

  getAdditionalInfo(userCity: string): void {
    this.http.get<ICurrentForecast>(`https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(currForecast => {
      this.http.get<IOneCall>(`https://api.openweathermap.org/data/2.5/onecall?lat=${currForecast.coord.lat}&lon=${currForecast.coord.lon}&exclude=minutely&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(
        bottomPanelData => {
          this.dataService.passCurrentAdditionalInformation(bottomPanelData.current);
        }
      );
    });
  }

  updateChart(): void {
    this.dataService.currentDataMainPanel.subscribe(forecast => {
      const data: any = forecast;
      const dataToPass: any = {};

      const times: ITimes = this.dataService.getTime(data.timezone, data.sys.sunrise, data.sys.sunset);
      if ((this.getTimeNumber(times.localTime) - (this.getTimeNumber(times.sunrise)) === 1 || 
        (this.getTimeNumber(times.localTime) - this.getTimeNumber(times.sunset)) === 1)) {
        this.chartLoading.next(true);
      }

      dataToPass.iconName = `../../../../assets/images/icons/Clear-${times.time}.png`;
      dataToPass.iconPosition = this.setChartIconPosition(times);

      dataToPass.chartPoints = times.time === 'day' ? this.setChartPoints('Sunrise', 'Sunset', times.sunrise, times.sunset) :
      this.setChartPoints('Sunset', 'Sunrise', times.sunset, times.sunrise);
      
      this.chart.next(dataToPass);
      setTimeout(() => {
        this.chartLoading.next(false);
      }, 1500);
    });
  }

  setChartPoints(firstPoint: string, secondPoint: string, firstPointTime: number, secondPointTime: number): Array<string> {
    return [
      `${firstPoint}: ${moment.utc(firstPointTime).format('HH:mm')}`, 
      `${secondPoint}: ${moment.utc(secondPointTime).format('HH:mm')}`
    ]
  }

  setChartIconPosition(times: any): object {
    const currentTime = moment.utc(times.localTime).format('HH:mm');
    const time = Number(currentTime.slice(0, 2)) * 60 + Number(currentTime.slice(3));
    const sunriseTime = moment.utc(times.sunrise).format('HH:mm');
    const sunrise = Number(sunriseTime.slice(0, 2)) * 60 + Number(sunriseTime.slice(3));
    const sunseTime = moment.utc(times.sunset).format('HH:mm');
    const sunset = Number(sunseTime.slice(0, 2)) * 60 + Number(sunseTime.slice(3));

    if (times.time === 'day') {
      return {'left': `${this.getIconPositionDay(time, sunrise, sunset)}%`};
    } else {
      return time <= sunset ? {'left': `${this.getIconPositionNight(time, sunrise, sunset, true)}%`} : 
      {'left': `${this.getIconPositionNight(time, sunrise, sunset, false)}%`};
    }
  }

  getIconPositionDay(time: number, sunrise: number, sunset: number): number {
    return Math.round(((Math.abs(((1440 - time) - (1440 - sunrise)) * 100))) / Math.abs((1440 - sunset) - (1440 - sunrise)));
  }

  getIconPositionNight(time: number, sunrise: number, sunset: number, timePositive: boolean): number {
    return timePositive ? Math.round(((Math.abs(((1440 - sunrise) - (1440 - sunset)) * 100))) / Math.abs((1440 - time) - (1440 - sunset))) :
    Math.round(((Math.abs(((1440 - time) - (1440 - sunset)) * 100))) / Math.abs((1440 - sunrise) - (1440 - sunset))); 
  }

  getTimeNumber(time: number): number {
    return Number(moment.utc(time).format('HH')) + Number(moment.utc(time).format('mm'));
  }
}
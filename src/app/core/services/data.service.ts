import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import * as moment from 'moment';

import * as forecastConstants from '../../shared/constants/constants';
import { IDays } from '../../shared/interfaces/days.interface';
import { IError } from 'src/app/shared/interfaces/error.interface';
import { IHourly } from 'src/app/shared/interfaces/hourly.interface';
import { IDaily } from 'src/app/shared/interfaces/daily.interface';
import { ICurrentForecast } from 'src/app/shared/interfaces/current-forecast.interface';
import { IGeolocation } from 'src/app/shared/interfaces/geolocation.interface';
import { IIpInfo } from 'src/app/shared/interfaces/ipinfo.interface';
import { ITimes } from 'src/app/shared/interfaces/times.interface';
import { IOneCall } from 'src/app/shared/interfaces/onecall.interface';
import { ICurrent } from 'src/app/shared/interfaces/current.interface';
import { ICurrentHourly } from 'src/app/shared/interfaces/current-hourly.interface';
import { ICurrentDaily } from 'src/app/shared/interfaces/current-daily.interface';
import { ICurrentAdditional } from 'src/app/shared/interfaces/current-additional.interface';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  atmosphere: Array<string> = ['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'];
  days: IDays = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
  }

  userCity = 'London';

  background = new BehaviorSubject<string>('linear-gradient(rgba(0, 0, 0), rgba(0, 0, 0))');
  currentBackground = this.background.asObservable();

  time = new BehaviorSubject<string>('day');
  currentDayTime = this.time.asObservable();

  dataMainPanel = new BehaviorSubject<object>(forecastConstants.currentWeather);
  currentDataMainPanel = this.dataMainPanel.asObservable();

  isLoading = new BehaviorSubject<boolean>(true);

  isLoadingBottomPanel = new BehaviorSubject<boolean>(true);

  updatePageInterval: any;

  errorObject = new BehaviorSubject<IError>({underlineWidth: '0px', displayErrorMessage: false});
  showError = this.errorObject.asObservable();

  tabs = new BehaviorSubject<string>('hourly');
  selectedTab = this.tabs.asObservable();

  infoAnimation = new BehaviorSubject<string>('show');
  showAnimation = this.infoAnimation.asObservable();

  dataHourlyForecast = new BehaviorSubject<ICurrentHourly[]>(forecastConstants.hourlyForecast);
  currentHourlyForecast = this.dataHourlyForecast.asObservable();

  dataDailyForecast = new BehaviorSubject<ICurrentDaily[]>(forecastConstants.dailyForecast);
  currentDailyForecast = this.dataDailyForecast.asObservable();

  dataAdditionalInfo = new BehaviorSubject<ICurrentAdditional>(forecastConstants.additionalInfo);
  currentAdditionalInfo = this.dataAdditionalInfo.asObservable();

  appInitialized = new BehaviorSubject<boolean>(false); 
  isAppInitialized = this.appInitialized.asObservable(); 

  constructor(private http: HttpClient) { }

  getCurrentLocationForecast(): void {
    // API that returns users location without asking permission
    this.http.get<IGeolocation>('https://geolocation-db.com/json/').subscribe(geolocation => {
    this.userCity = geolocation.city;
    geolocation && geolocation.city === null ? this.getIpInfo() : this.getForecast(this.userCity, true, false);
    }, () => {
      // To use google maps platform credit card must be added in developers console (user gives permission for location)
      // navigator.geolocation.watchPosition(position => {
      //   console.log(position);
      //   this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.longitude},${position.latitude}&key=AIzaSyA10gQ4smJSd7mfYAnLIvxUo1Slj5U_xqU`).subscribe(
      //     response => {
      //       console.log(response);
      //     }
      //   )
      // },
      // error => {
      //   if (error.code == error.PERMISSION_DENIED)
      //     console.log("permission denied");
      //     userCity = 'London';
      // });

      // Second API which will return users location without asking permission if first one will return error 
      this.getIpInfo();
    });
  }

  getIpInfo(): void {
    this.http.get<IIpInfo>('https://ipinfo.io/json?token=3ec256f8e98cdd').subscribe(reserveGeolocation => {
      this.userCity = reserveGeolocation.city;
      reserveGeolocation && reserveGeolocation.city === null ? 
      this.getForecast('London', true, false) : 
      this.getForecast(this.userCity, true, false);
    }, () => {
      this.getForecast('London', true, false);
    });
  }

  getForecast(userCity: string, bottomPanelForecast: boolean, appInit: boolean): void | null {
    this.http.get<ICurrentForecast>(`https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(currForecast => {
      this.userCity = userCity;
      let weather;
      this.atmosphere.find(elem => elem === currForecast.weather[0].main) ? weather = 'Atmosphere' : weather = currForecast.weather[0].main;
      currForecast.weather[0].description === 'few clouds' ? weather = 'Clear' : weather = weather;
      
      const times: ITimes = this.getTime(currForecast.timezone, currForecast.sys.sunrise, currForecast.sys.sunset);

      this.background.next(`linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../../assets/images/backgrounds/${weather}-${times.time}.jpg')`);
      this.time.next(times.time);

      this.passCurrentForecast(currForecast, userCity, times.time, this.dataMainPanel);

      if (bottomPanelForecast) {
        if (!appInit) this.isLoadingBottomPanel.next(true);
        this.http.get<IOneCall>(`https://api.openweathermap.org/data/2.5/onecall?lat=${currForecast.coord.lat}&lon=${currForecast.coord.lon}&exclude=minutely&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(
          bottomPanelData => {
            this.passCurrentHourlyForecast(bottomPanelData.hourly, times.sunrise, times.sunset);
            this.passCurrentDailyForecast(bottomPanelData.daily, null, null);
            this.passCurrentAdditionalInformation(bottomPanelData.current);
            this.isLoadingBottomPanel.next(false);
          }, () => {}
        )
      } else {
        return;
      }
      if (!appInit) this.appInitialized.next(true); 
      this.errorObject.next({underlineWidth: '0px', displayErrorMessage: false});
    }, () => {
      this.errorObject.next({underlineWidth: '100%', displayErrorMessage: true});
      this.infoAnimation.next('');
    })
  }

  passCurrentForecast(forecast: ICurrentForecast, city: string, time: string, behSubject: any): void {
    forecast.city = city;
    this.atmosphere.find(elem => elem === forecast.weather[0].main) ? forecast.iconName = 'Atmosphere' : forecast.iconName = forecast.weather[0].main;
    forecast.weather[0].description === 'few clouds' ? forecast.iconName = 'Clouds-few' : forecast.iconName = forecast.iconName;
    forecast.iconName === 'Clear' || forecast.iconName === 'Clouds-few' ? forecast.iconName += '-' + time : forecast.iconName = forecast.iconName;
    forecast.iconName = `../../../../assets/images/icons/${forecast.iconName}.png`;

    forecast.currentDateTime = this.setCurrentTime(forecast.dt, forecast.timezone);
    behSubject.next(forecast);
  }

  setCurrentTime(date: number, timezone: number): string {
    // Without using moment.js library, JavaScript Date object adds two extra hours from API call, and it is almost imposible to fix in few lines of code
    // let currentDate = new Date(date * 1000).toString().slice(0, 15).split(' ');
    
    const currentTime = new Date(Date.now() + 1000 * timezone).toISOString().substr(11, 5);
    const currentDate = moment.utc(new Date(Date.now() + 1000 * timezone)).format('dddd MMM D YY').split(' ');

    // return `${currentTime} ${this.days[currentDate[0] as keyof IDays]}, ${currentDate[2]} ${currentDate[1]}'${currentDate[currentDate.length - 1].slice(2)}`;
    return `${currentTime} ${currentDate[0]}, ${currentDate[2].slice(0, 2)} ${currentDate[1]}'${currentDate[currentDate.length - 1]}`;
  }

  getCurrrentTimaAndDate(city: string): void {
    this.http.get<ICurrentForecast>(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(currForecast => {
      const times: ITimes = this.getTime(currForecast.timezone, currForecast.sys.sunrise, currForecast.sys.sunset);
      this.passCurrentForecast(currForecast, city, times.time, this.dataMainPanel);
    });
  }

  updatePageForecast(): void {
    this.updatePageInterval = setInterval(()=> {
      this.isLoading.next(true);
      this.getForecast(this.userCity, true, true);
    }, 300000);
  }

  passCurrentHourlyForecast(dataArray: Array<IHourly>, sunrise: number, sunset: number): void {
    let currentTime: string;
    this.currentDataMainPanel.pipe(take(1)).subscribe(res => {
      const data: any = res;
      currentTime = data.currentDateTime.slice(0, 2) + ':00';
    });
    
    const spliceIndex = dataArray.findIndex(elem => {
      return moment.utc(elem.dt * 1000).format('HH:00') === currentTime;
    })

    const dataToPass: Array<ICurrentHourly> = [];
    dataArray.splice(spliceIndex + 1, 24).forEach(elem => {
      dataToPass.push({
        time: moment.utc(elem.dt * 1000).format('HH:00'),
        temp: elem.temp,
        weather: elem.weather[0],
        iconName: this.setIconName(elem, sunrise, sunset)
      }); 
    });
    this.dataHourlyForecast.next(dataToPass);
  }

  passCurrentDailyForecast(dataArray: Array<IDaily>, sunrise: number | null, sunset: number | null): void {
    const dataToPass: Array<ICurrentDaily> = [];
    dataArray.forEach(elem => {
      dataToPass.push({
        date: moment.utc(elem.dt * 1000).format('dddd MMMM D').split(' '),
        tempPoints: elem.temp,
        weather: elem.weather[0],
        iconName: this.setIconName(elem, sunrise, sunset)
      });
    });
    this.dataDailyForecast.next(dataToPass);
  }

  passCurrentAdditionalInformation(dataArray: ICurrent): void {
    let dataToPass: ICurrentAdditional;
    dataToPass = {
      feelsLike: dataArray.feels_like,
      windSpeed: dataArray.wind_speed,
      pressure: dataArray.pressure,
      humidity: dataArray.humidity
    };
    this.dataAdditionalInfo.next(dataToPass);
  }

  setIconName(forecast: IDaily | IHourly, sunrise: number | null, sunset: number | null): string {
    let time;
    if (sunrise && sunset) {
      this.getHourNumber(forecast.dt * 1000) > this.getHourNumber(sunrise) && this.getHourNumber(forecast.dt * 1000) < this.getHourNumber(sunset) ? 
      time = 'day' : time = 'night';
    } else {
      time = 'day';
    }
    let iconName: string;
    this.atmosphere.find(elem => elem === forecast.weather[0].main) ? iconName = 'Atmosphere' : iconName = forecast.weather[0].main;
    forecast.weather[0].description === 'few clouds' ? iconName = 'Clouds-few' : iconName = iconName;
    iconName === 'Clear' || iconName === 'Clouds-few' ? iconName += '-' + time : iconName = iconName;
    return `../../../../assets/images/icons/${iconName}.png`;
  }

  getHourNumber(dt: number): number {
    return Number(moment.utc(dt).format('HH'));
  }

  getTime(timezone: number, sunrise: number, sunset: number): ITimes {
    let dayTime;      
    const nowInLocalTime = Date.now() + 1000 * timezone;
    const sunriseTime = (sunrise * 1000) + 1000 * timezone;
    const sunsetTime = (sunset * 1000) + 1000 * timezone;
    nowInLocalTime > sunriseTime && nowInLocalTime < sunsetTime ? dayTime = 'day' : dayTime = 'night';
    return {
      time: dayTime,
      sunrise: sunriseTime,
      sunset: sunsetTime,
      localTime: nowInLocalTime
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { ICurrentForecast } from 'src/app/shared/interfaces/current-forecast.interface';
import { ITimes } from 'src/app/shared/interfaces/times.interface';
import { DataService } from './data.service';
import { ICities } from 'src/app/shared/interfaces/cities.interface';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  atmosphere: Array<string> = ['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'];
  defaultCities: Array<string> = ['Lima', 'Berlin', 'Atlanta', 'Kyiv'];

  citiesForecast = new BehaviorSubject<Array<ICities>>([]);
  currentCitiesForecast = this.citiesForecast.asObservable();

  errorCallSubject = new BehaviorSubject<string>('loading');
  errorCallSpinner = this.errorCallSubject.asObservable();
  showErrorMessage = false;

  constructor(private http: HttpClient, private dataService: DataService) { }

  getCityForecast(cityName: string): Promise<ICities> { 
    return new Promise((resolve, reject) => {
      this.http.get<ICurrentForecast>(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=cdcbe152f500b2f51d3d28e8fad187b5`).subscribe(forecast => {
        let weather;
        this.atmosphere.find(elem => elem === forecast.weather[0].main) ? weather = 'Atmosphere' : weather = forecast.weather[0].main;
        forecast.weather[0].description === 'few clouds' ? weather = 'Clear' : weather = weather;
        
        let times: ITimes = this.dataService.getTime(forecast.timezone, forecast.sys.sunrise, forecast.sys.sunset);
        let localTime: string = new Date(Date.now() + 1000 * forecast.timezone).toISOString().substr(11, 5);

        let background = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../../assets/images/backgrounds/${weather}-${times.time}.jpg')`;
  
        let iconName = this.getIconName(forecast.weather[0].main, forecast.weather[0].description, times.time);
        resolve({
          localTime: localTime,
          dayTime: times.time,
          background: background,
          temperature: forecast.main.temp,
          iconName: iconName,
          weatherStatus: forecast.weather[0].description,
          cityName: cityName,
          showInputError: {underlineWidth: '0px', displayErrorMessage: false},
          showSpinner: false
        });
      }, () => {
        reject(null); 
      })
    }) 
  }

  checkCitiesInStorage(showAnimation: boolean): Promise<ICities[]> {
    this.showErrorMessage = false;
    if (localStorage.getItem('cities')) {
      return this.getCitiesForecast(JSON.parse(localStorage.getItem('cities') || JSON.stringify(this.defaultCities)), showAnimation);
    } else {
      localStorage.setItem('cities', JSON.stringify(this.defaultCities));
      return this.getCitiesForecast(this.defaultCities, showAnimation);
    }
  }

  async getCitiesForecast(cities: Array<string>, showAnimation: boolean): Promise<ICities[]> {
    try {
      const citiesPromises = cities.map(city => {
        return this.getCityForecast(city);
      });

      const citiesToPass: Array<ICities> = await Promise.all(citiesPromises);
      
      if (showAnimation) {
        this.citiesForecast.next(citiesToPass);
        this.errorCallSubject.next('success');
      }
      return citiesToPass;
    } catch (error) {
      this.errorCallSubject.next('retry');
      this.showErrorMessage = true;
      return [];
    }
  }

  getIconName(main: string, description: string, dayTime: string): string {
    let iconName;
    this.atmosphere.find(elem => elem === main) ? iconName = 'Atmosphere' : iconName = main;
    description === 'few clouds' ? iconName = 'Clouds-few' : iconName = iconName;
    iconName === 'Clear' || iconName === 'Clouds-few' ? iconName += '-' + dayTime : iconName = iconName;
    return iconName = `../../../../assets/images/icons/${iconName}.png`;
  }
}

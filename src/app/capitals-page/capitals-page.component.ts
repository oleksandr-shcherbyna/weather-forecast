import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { state, style, transition, trigger, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';

import { CitiesService } from '../core/services/cities.service';
import { WindowService } from '../core/services/window.service';
import { ICities } from '../shared/interfaces/cities.interface';
import { Unsubscriber } from '../shared/unsubscriber.class';

@Component({
  selector: 'app-capitals-page',
  templateUrl: './capitals-page.component.html',
  styleUrls: ['./capitals-page.component.scss'],
  animations: [
    trigger('errorState', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0px)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(60px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300),
        style({
          opacity: 0,
          transform: 'translateX(-60px)'
        })
      ])
    ]),
    trigger('showForecast', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0px)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(20px)'
        }),
        animate(300)
      ])
    ])
  ]
})
export class CapitalsPageComponent extends Unsubscriber implements OnInit, OnDestroy {
  citiesForecast: Array<ICities> = [];
  showErrorSpinner: string = 'loading';
  showRetryButton: boolean = false;
  retryCallSeconds: number = 0;
  callInterval: any;
  refreshInterval: any;
  refreshTimeout: any;
  form = new FormGroup({
    newCity: new FormControl('', [
      Validators.pattern(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/),
      Validators.required
    ])
  });

  constructor(public citiesService: CitiesService, private winRef: WindowService, private cd: ChangeDetectorRef) {
    super();
   }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('init') || '')) {
      const citiesPromises = this.citiesService.checkCitiesInStorage(false);
      this.rewriteData(citiesPromises);
    };
    this.citiesService.currentCitiesForecast.pipe(takeUntil(this.unsubscribe)).subscribe(citiesForecast => {
      this.citiesForecast = citiesForecast;
    });
    this.citiesService.errorCallSpinner.pipe(takeUntil(this.unsubscribe)).subscribe(errorCall => {
      this.showErrorSpinner = errorCall;
      if (errorCall === 'retry') {
        clearTimeout(this.refreshTimeout);
        clearInterval(this.refreshInterval);
        this.tryCallAgain(60);
        this.winRef.nativeWindow.addEventListener('blur', this.browserTabInactive.bind(this));
      }
      else if (errorCall === 'success') {
        this.refreshData();
      }
    });
  }

  tryCallAgain(seconds: number): void {
    this.retryCallSeconds = seconds;
    this.callInterval = setInterval(() => {
      this.retryCallSeconds--;
      if (this.retryCallSeconds === 0) {
        clearInterval(this.callInterval);
        this.citiesService.checkCitiesInStorage(true);
      }
    }, 1000);
  }

  browserTabInactive(): void {
    clearInterval(this.callInterval);
    this.showRetryButton = true;
  }

  hideButton(): void {
    this.showRetryButton = false;
  }

  searchNewCity(cityIndex: number): void {
    if (this.form.invalid) {
      this.citiesForecast[cityIndex].showInputError = {underlineWidth: '100%', displayErrorMessage: true};
      this.form.reset();
      return;
    }
    this.citiesForecast[cityIndex].showSpinner = true;
    this.citiesService.getCityForecast(this.form.controls['newCity'].value).then(cityData => {
      const cities: Array<string> = JSON.parse(localStorage.getItem('cities') || JSON.stringify(this.citiesService.defaultCities));
      cities[cityIndex] = cityData.cityName;
      localStorage.setItem('cities', JSON.stringify(cities));
      this.citiesForecast[cityIndex] = cityData;
      this.citiesService.citiesForecast.next(this.citiesForecast);
    }).catch(() => {
      this.citiesForecast[cityIndex].showSpinner = false;
      this.citiesForecast[cityIndex].showInputError = {underlineWidth: '100%', displayErrorMessage: true};
    });
    this.form.reset();
    this.cd.detectChanges();
  }

  removeError(cityIndex: number): void {
    this.citiesForecast[cityIndex].showInputError = {underlineWidth: '0px', displayErrorMessage: false};
  }

  refreshData(): void {
    this.refreshTimeout = setTimeout(() => { 
      const citiesPromises = this.citiesService.checkCitiesInStorage(false);
      this.rewriteData(citiesPromises);
      this.refreshInterval = setInterval(() => {
        const citiesPromises = this.citiesService.checkCitiesInStorage(false);
        this.rewriteData(citiesPromises);
      }, 60000)
    }, (60 - new Date().getSeconds()) * 1000);
  }

  rewriteData(citiesPromises: Promise<ICities[]>): void {
    citiesPromises.then(citiesForecast => {
      this.citiesForecast.forEach((city, index) => {
        city.localTime = citiesForecast[index].localTime;
        city.dayTime = citiesForecast[index].dayTime;
        city.background = citiesForecast[index].background;
        city.temperature = citiesForecast[index].temperature;
        city.iconName = citiesForecast[index].iconName;
        city.weatherStatus = citiesForecast[index].weatherStatus;
        city.cityName = citiesForecast[index].cityName;
      })
    })
  }

  ngOnDestroy(): void {
    localStorage.setItem('init', JSON.stringify(true));
    clearInterval(this.callInterval);
    clearTimeout(this.refreshTimeout);
    clearInterval(this.refreshInterval);
  }
}

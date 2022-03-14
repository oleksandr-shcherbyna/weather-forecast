import { Component, OnDestroy, OnInit } from '@angular/core';
import { state, style, transition, trigger, animate } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { Unsubscriber } from '../../unsubscriber.class';
import { DataService } from 'src/app/core/services/data.service';
import { IError } from '../../interfaces/error.interface';
import * as initialForecast from '../../constants/constants';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
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
    trigger('infoState', [
      state('show', style({
        opacity: 1,
        transform: 'translateX(0px)'
      })),
      transition('void => show', [
        style({
          opacity: 0,
          transform: 'translateX(30px)'
        }),
        animate(300)
      ])
    ])
  ]
})

export class InfoPanelComponent extends Unsubscriber implements OnInit, OnDestroy {
  serchBarColor = 'rgb(0, 0, 0, 0.4)';
  currentForecast: any = initialForecast.currentWeather;
  dataLoaded = true;
  getCurrentTimeInterval: any;
  getCurrentTimeTimeout: any;
  form = new FormGroup({
    newCity: new FormControl('', [
      Validators.pattern(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/),
      Validators.required
    ])
  });
  showError: IError = {underlineWidth: '0px', displayErrorMessage: false};
  showAnimation = 'show';

  constructor(public dataService: DataService) {
    super();
  }

  ngOnInit(): void {
    this.dataService.currentDayTime.pipe(takeUntil(this.unsubscribe)).subscribe(dayTime => {
      dayTime === 'day' ? this.serchBarColor = 'rgb(0, 0, 0, 0.4)' : this.serchBarColor = 'rgb(255, 255, 255, 0.1)';
    });
    this.dataService.currentDataMainPanel.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.currentForecast = data;
    });
    this.dataService.showError.pipe(takeUntil(this.unsubscribe)).subscribe(errorObject => {
      this.showError = errorObject;
    });
    this.dataService.showAnimation.pipe(takeUntil(this.unsubscribe)).subscribe(animationState => {
      this.showAnimation = animationState;
    });
    this.getCurrentTimeAndDate();
  }

  ngOnDestroy(): void {
      clearInterval(this.getCurrentTimeInterval);
      clearTimeout(this.getCurrentTimeTimeout);
      clearInterval(this.dataService.updatePageInterval);
    }

  searchNewCity(): void {
    if (this.form.invalid) {
      this.dataService.errorObject.next({underlineWidth: '100%', displayErrorMessage: true});
      this.form.reset();
      return;
    }
    clearInterval(this.dataService.updatePageInterval);
    this.dataService.isLoading.next(true);
    this.dataService.getForecast(this.form.controls['newCity'].value, true, true);
    this.dataService.updatePageForecast();
  }

  getCurrentTimeAndDate(): void {
    this.getCurrentTimeTimeout = setTimeout(() => { 
      this.dataService.getCurrrentTimaAndDate(this.currentForecast.city);
      this.getCurrentTimeInterval = setInterval(() => {
        this.dataService.getCurrrentTimaAndDate(this.currentForecast.city);
      }, 60000)
    }, (60 - new Date().getSeconds()) * 1000);
  }

  removeError(): void {
    this.dataService.errorObject.next({underlineWidth: '0px', displayErrorMessage: false});
  }
}
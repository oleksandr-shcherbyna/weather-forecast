import { Component, OnInit } from '@angular/core';
import { state, style, transition, trigger, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { Unsubscriber } from '../../unsubscriber.class';
import { DataService } from 'src/app/core/services/data.service';
import { BottomPanelForecastService } from 'src/app/core/services/bottom-panel-forecast.service';
import { ITemperatureItem } from '../../interfaces/temperature-items.interface';
import { ICurrentDaily } from '../../interfaces/current-daily.interface';
import * as forecastConstants from '../../constants/constants';


@Component({
  selector: 'app-daily-forecast',
  templateUrl: './daily-forecast.component.html',
  styleUrls: ['./daily-forecast.component.scss'],
  animations: [
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

export class DailyForecastComponent extends Unsubscriber implements OnInit {
  dailyForecast: Array<ICurrentDaily> = forecastConstants.dailyForecast;
  isDailyForecastPage: boolean = false;
  temperatureItems: Array<ITemperatureItem> = [
    {
      name: 'Night:',
      key: 'night'
    },
    {
      name: 'Morning:',
      key: 'morn'
    },
    {
      name: 'Day:',
      key: 'day'
    },
    {
      name: 'Evening:',
      key: 'eve'
    },
    {
      name: 'Maximum:',
      key: 'max'
    },
    {
      name: 'Minimum:',
      key: 'min'
    },
  ]

  constructor(public dataService: DataService, private bottomPanelService: BottomPanelForecastService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.dataService.currentDailyForecast.pipe(takeUntil(this.unsubscribe)).subscribe(forecast => {
      this.dailyForecast = forecast;
    });
    this.dataService.currentDataMainPanel.pipe(takeUntil(this.unsubscribe)).subscribe(dataMainPanel => {
      const data: any = dataMainPanel;
      if (data.currentDateTime.slice(0, 5) === '00:00') {
        this.bottomPanelService.getDailyForecast(this.dataService.userCity);
      }
    });
    this.router.url === '/daily-forecast' ? this.isDailyForecastPage = true : this.isDailyForecastPage = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { state, style, transition, trigger, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';

import { Unsubscriber } from 'src/app/shared/unsubscriber.class';
import { BottomPanelForecastService } from 'src/app/core/services/bottom-panel-forecast.service';
import { DataService } from 'src/app/core/services/data.service';
import { ICurrentHourly } from 'src/app/shared/interfaces/current-hourly.interface';
import * as forecastConstants from '../../../shared/constants/constants';

@Component({
  selector: 'app-hourly-forecast',
  templateUrl: './hourly-forecast.component.html',
  styleUrls: ['./hourly-forecast.component.scss'],
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

export class HourlyForecastComponent extends Unsubscriber implements OnInit {
  hourlyForecast: ICurrentHourly[] = forecastConstants.hourlyForecast;

  constructor(public bottomPanelService: BottomPanelForecastService, public dataService: DataService) {
    super();
  }

  ngOnInit(): void {
    this.dataService.currentHourlyForecast.pipe(takeUntil(this.unsubscribe)).subscribe(resp => {
      this.hourlyForecast = resp;
    });
    this.dataService.currentDataMainPanel.pipe(takeUntil(this.unsubscribe)).subscribe(dataMainPanel => {
      const data: any = dataMainPanel;
      if (data.currentDateTime.slice(3, 5) === '00') {
        this.bottomPanelService.getHourlyForecast(this.dataService.userCity);
      }
    });
  }

}

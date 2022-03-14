import { Component, OnDestroy, OnInit } from '@angular/core';
import { state, style, transition, trigger, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';

import { Unsubscriber } from 'src/app/shared/unsubscriber.class';
import { DataService } from 'src/app/core/services/data.service';
import { BottomPanelForecastService } from 'src/app/core/services/bottom-panel-forecast.service';
import { ICurrentAdditional } from 'src/app/shared/interfaces/current-additional.interface';
import { IChart } from 'src/app/shared/interfaces/chart.interface';
import * as forecastConstants from '../../../shared/constants/constants';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss'],
  animations: [
    trigger('showInfo', [
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
    ]),
    trigger('chartState', [
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

export class AdditionalInfoComponent extends Unsubscriber implements OnInit, OnDestroy {
  additionalInfo: ICurrentAdditional = forecastConstants.additionalInfo;
  chartData: IChart = forecastConstants.chart;
  math = Math;
  number = Number;
  getAdditionalInfoInterval: any;
  getAdditionalInfoTimeout: any;

  constructor(public dataService: DataService, public bottomPanelService: BottomPanelForecastService) {
    super();
  }

  ngOnInit(): void {
    this.dataService.currentAdditionalInfo.pipe(takeUntil(this.unsubscribe)).subscribe(info => this.additionalInfo = info);
    this.bottomPanelService.currentChartData.pipe(takeUntil(this.unsubscribe)).subscribe(charData => this.chartData = charData);
    this.bottomPanelService.updateChart();
    this.getCurrentAdditionalInfo();
  }

  ngOnDestroy(): void {
    clearInterval(this.getAdditionalInfoInterval);
    clearTimeout(this.getAdditionalInfoTimeout);
  }

  getCurrentAdditionalInfo(): void {
    this.getAdditionalInfoTimeout = setTimeout(() => { 
      this.bottomPanelService.getAdditionalInfo(this.dataService.userCity);
      this.getAdditionalInfoInterval = setInterval(() => {
        this.bottomPanelService.getAdditionalInfo(this.dataService.userCity);
      }, 60000)
    }, (60 - new Date().getSeconds()) * 1000);
  }
}

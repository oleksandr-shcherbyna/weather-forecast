import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DataService } from '../core/services/data.service';
import { Unsubscriber } from '../shared/unsubscriber.class';

@Component({
  selector: 'app-daily-page',
  templateUrl: './daily-page.component.html',
  styleUrls: ['./daily-page.component.scss']
})
export class DailyPageComponent extends Unsubscriber implements OnInit, OnDestroy {
  background: string = "linear-gradient(rgba(0, 0, 0), rgba(0, 0, 0))";

  constructor(public dataService: DataService) {
    super();
  }

  ngOnInit(): void {
    this.dataService.currentBackground.pipe(takeUntil(this.unsubscribe)).subscribe(curretBackground => this.background = curretBackground);
    this.dataService.isAppInitialized.pipe(takeUntil(this.unsubscribe)).subscribe(appInit => {
      if (appInit && JSON.parse(localStorage.getItem('init') || '')) this.dataService.getForecast(this.dataService.userCity, true, true);
    });
    this.dataService.updatePageForecast();
  }

  ngOnDestroy(): void {
    localStorage.setItem('init', JSON.stringify(true));
    clearInterval(this.dataService.updatePageInterval);      
  }

}

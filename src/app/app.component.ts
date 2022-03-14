import { Component, OnInit } from '@angular/core';

import { DataService } from './core/services/data.service';
import { CitiesService } from './core/services/cities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private dataService: DataService, private citiesService: CitiesService) {}

  ngOnInit(): void {
      this.dataService.getCurrentLocationForecast();
      this.citiesService.checkCitiesInStorage(true);
      localStorage.setItem('init', JSON.stringify(false));
  }
}

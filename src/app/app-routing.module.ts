import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MainPageComponent } from './main-page/main-page.component';
import { PanelTabsComponent } from './main-page/components/panel-tabs/panel-tabs.component';
import { HourlyForecastComponent } from './main-page/components/hourly-forecast/hourly-forecast.component';
import { AdditionalInfoComponent } from './main-page/components/additional-info/additional-info.component';
import { DailyPageComponent } from './daily-page/daily-page.component';
import { CapitalsPageComponent } from './capitals-page/capitals-page.component';
import { AuthorPageComponent } from './author-page/author-page.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainPageComponent
  },
  {
    path: 'daily-forecast',
    component: DailyPageComponent
  },
  {
    path: 'capitals-forecast',
    component: CapitalsPageComponent
  },
  {
    path: 'author',
    component: AuthorPageComponent
  },
  {
    path: '**',
    redirectTo: '/main'
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    MainPageComponent,
    DailyPageComponent,
    CapitalsPageComponent,
    AuthorPageComponent,
    PanelTabsComponent,
    HourlyForecastComponent,
    AdditionalInfoComponent
  ]
})

export class AppRoutingModule { }

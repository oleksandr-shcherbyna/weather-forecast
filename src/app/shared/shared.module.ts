import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SimplebarAngularModule } from 'simplebar-angular';

import { MaterialModule } from './material/material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';
import { TemperaturePipe } from './pipes/temperature.pipe';
import { LetterTransformPipe } from './pipes/letter-transform.pipe';
import { BottomPanelComponent } from './components/bottom-panel/bottom-panel.component';
import { DailyForecastComponent } from './components/daily-forecast/daily-forecast.component';

const components = [
  NavbarComponent,
  InfoPanelComponent,
  BottomPanelComponent,
  DailyForecastComponent
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SimplebarAngularModule
  ],
  exports: [
    MaterialModule,
    ...components,
    TemperaturePipe,
    ReactiveFormsModule,
    FormsModule,
    LetterTransformPipe
  ],
  declarations: [
    ...components,
    TemperaturePipe,
    LetterTransformPipe,
  ]
})
export class SharedModule { }

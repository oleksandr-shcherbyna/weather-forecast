import { TestBed } from '@angular/core/testing';

import { BottomPanelForecastService } from './bottom-panel-forecast.service';

describe('HourlyForecastService', () => {
  let service: BottomPanelForecastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BottomPanelForecastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'

import { DataService } from './data.service';
import { BottomPanelForecastService } from './bottom-panel-forecast.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public dataService: DataService, public bottomPanelService: BottomPanelForecastService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // this.dataService.isLoading.next(true);
      this.dataService.infoAnimation.next('show');

      return next.handle(req).pipe(
        finalize(() => {
          this.dataService.isLoading.next(false);
        })
      )
  }
}

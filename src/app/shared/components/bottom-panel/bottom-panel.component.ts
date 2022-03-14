import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DataService } from 'src/app/core/services/data.service';
import { Unsubscriber } from '../../unsubscriber.class';

@Component({
  selector: 'app-bottom-panel',
  templateUrl: './bottom-panel.component.html',
  styleUrls: ['./bottom-panel.component.scss']
})
export class BottomPanelComponent extends Unsubscriber implements OnInit {
  @ViewChild('scrollBlock') el!: ElementRef;

  panelColor = 'rgb(0, 0, 0, 0.4)';
  options = {autoHide: true, scrollbarMinSize: 150, scrollbarMaxSize: 200}
  
  constructor(private dataService: DataService) {
    super();
  }

  ngOnInit(): void {
    this.dataService.currentDayTime.pipe(takeUntil(this.unsubscribe)).subscribe(dayTime => {
      dayTime === 'day' ? this.panelColor = 'rgb(0, 0, 0, 0.4)' : this.panelColor = 'rgb(255, 255, 255, 0.05)';
    });
  }

  wheelScrollSimpleBar(event: WheelEvent): void {
    event.preventDefault();
    const elementToScroll  = this.el.nativeElement.querySelector('.simplebar-content-wrapper');
    clearTimeout(elementToScroll.timer);
    elementToScroll.timer = setTimeout(() => {
      elementToScroll.scrollTo({ left: event.deltaY > 0 ? elementToScroll.scrollLeft + 250 : elementToScroll.scrollLeft - 250, behavior: 'smooth' });
    }, 0);
  }
}

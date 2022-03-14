import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { state, style, transition, trigger, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';

import { DataService } from 'src/app/core/services/data.service';
import { Unsubscriber } from 'src/app/shared/unsubscriber.class';

@Component({
  selector: 'app-panel-tabs',
  templateUrl: './panel-tabs.component.html',
  styleUrls: ['./panel-tabs.component.scss'],
  animations: [
    trigger('iconState', [
      state('in', style({
        opacity: 1,
        transform: 'rotate(90deg) translateY(-80%) scale(1.2)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'rotate(90deg) translateY(-120%) scale(1.2)'
        }),
        animate(300)
      ])
    ])
  ]
})

export class PanelTabsComponent extends Unsubscriber implements OnInit {
  @Output() tabClickEvent = new EventEmitter<string>();
  tabs = [
    {
      content: 'Hourly forecast (24 hours)',
      selected: true,
      selectNgContent: 'hourly' 
    },
    {
      content: 'Daily forecast (7 days)',
      selected: false,
      selectNgContent: 'daily' 
    },
    {
      content: 'Additional information',
      selected: false,
      selectNgContent: 'additional' 
    }
  ]
  contentToShow = 'hourly';

  constructor(private dataService: DataService) {
    super();
  }

  ngOnInit(): void {
    this.dataService.selectedTab.pipe(takeUntil(this.unsubscribe)).subscribe(tab => this.contentToShow = tab);
    this.tabs.forEach(tab => {
      tab.selectNgContent === this.contentToShow ? tab.selected = true : tab.selected = false;
    });
  }

  chooseTab(tabId: number): void {
    this.tabs.forEach((tab, index) => {
      tabId === index ? (tab.selected = true, this.contentToShow = tab.selectNgContent) : tab.selected = false;
    });
    this.tabClickEvent.emit(this.contentToShow);
  }
}

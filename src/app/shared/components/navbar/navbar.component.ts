import { Component, OnDestroy, OnInit } from '@angular/core';
import { state, style, transition, trigger, animate } from '@angular/animations';

import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
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
        animate(150)
      ])
    ])
  ]
})

export class NavbarComponent implements OnInit, OnDestroy {
  links = [
    {
      routerLink: 'main',
      linkTitle: 'Main',
      selected: false
    },
    {
      routerLink: 'daily-forecast',
      linkTitle: 'Daily forecast (16 days)',
      selected: false
    },
    {
      routerLink: 'capitals-forecast',
      linkTitle: 'Forecast in cities',
      selected: false
    },
    {
      routerLink: 'author',
      linkTitle: 'About author',
      selected: false
    }
  ]

  showPart: boolean = false;
  showNavPanel: boolean = false;
  showPrompt: boolean = false;
  rotateIcon: boolean = false;
  navPrompt: any;
  navBarColor = 'background: rgb(0, 0, 0, 0.4)';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.navPromptInterval();
    this.links.forEach(link => {
      link.routerLink === location.pathname.slice(1) ? link.selected = true : link.selected = false;
    })
    this.dataService.currentDayTime.subscribe(dayTime => {
      dayTime === 'day' ? this.navBarColor = 'rgb(0, 0, 0, 0.4)' : this.navBarColor = 'rgb(255, 255, 255, 0.1)';
    })
  }

  ngOnDestroy(): void {
      clearInterval(this.navPrompt);
  }

  showNavbarPart(): void {
    this.showPart = true;
    clearInterval(this.navPrompt);
  }

  hideNavBarPart(): void {
    this.showPart = false;
    if (!this.showNavPanel) {
      this.navPromptInterval();
    }
  }

  showNavbar(): void {
    this.showNavPanel = !this.showNavPanel;
    this.showNavPanel ? this.navPromptInterval() : clearInterval(this.navPrompt);
    this.showPart = false;
    this.rotateIcon = !this.rotateIcon;
  }

  navPromptInterval(): void {
    this.navPrompt = setInterval(() => {
      this.showPrompt = !this.showPrompt;
      setTimeout(() => {
        this.showPrompt = !this.showPrompt;
      }, 3000);
    }, 30000);
  }

  selectLink(linkIndex: number): void {
    this.links.forEach((link, linkNumber) => {
      linkNumber == linkIndex ? link.selected = true : link.selected = false;
    });
  }
}

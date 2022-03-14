import { Component, OnDestroy, OnInit } from '@angular/core';
import { state, style, transition, trigger, animate } from '@angular/animations';

import { ILinks } from '../shared/interfaces/links.interface';

@Component({
  selector: 'app-author-page',
  templateUrl: './author-page.component.html',
  styleUrls: ['./author-page.component.scss'],
  animations: [
    trigger('message', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0px)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(30px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300),
        style({
          opacity: 0,
          transform: 'translateY(30px)'
        })
      ])
    ]),
    trigger('showContent', [
      state('in', style({
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

export class AuthorPageComponent implements OnInit, OnDestroy {
  showMessage = false;
  showList = false;
  links: ILinks[] = [
    {
      tooltip: 'Github',
      link: 'https://github.com/oleksandr-shcherbyna',
      classNames: 'fa-brands fa-github author-page__icon'
    },
    {
      tooltip: 'Linkedin',
      link: 'https://www.linkedin.com/in/oleksandrShcherbyna',
      classNames: 'fa-brands fa-linkedin author-page__icon'
    },
    {
      tooltip: 'Facebook',
      link: 'https://www.facebook.com/Marble.78.SS',
      classNames: 'fa-brands fa-facebook author-page__icon'
    },
    {
      tooltip: 'Instagram',
      link: 'https://instagram.com/sani4_78?utm_medium=copy_link',
      classNames: 'fa-brands fa-instagram author-page__icon'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  showPhotoMessage(): void {
    if (this.showMessage) {
      return;
    } else {
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 3000);
    }
  }

  showTechnologies(): void {
    this.showList = !this.showList;
  }

  ngOnDestroy(): void {
    localStorage.setItem('init', JSON.stringify(true));
  }
}

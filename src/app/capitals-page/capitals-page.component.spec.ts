import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalsPageComponent } from './capitals-page.component';

describe('CapitalsPageComponent', () => {
  let component: CapitalsPageComponent;
  let fixture: ComponentFixture<CapitalsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitalsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

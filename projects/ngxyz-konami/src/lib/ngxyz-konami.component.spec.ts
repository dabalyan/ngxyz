import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxyzKonamiComponent } from './ngxyz-konami.component';

describe('NgxyzKonamiComponent', () => {
  let component: NgxyzKonamiComponent;
  let fixture: ComponentFixture<NgxyzKonamiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxyzKonamiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxyzKonamiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

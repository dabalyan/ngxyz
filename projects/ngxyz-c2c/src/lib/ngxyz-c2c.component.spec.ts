import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxyzC2cComponent } from './ngxyz-c2c.component';

describe('NgxyzC2cComponent', () => {
  let component: NgxyzC2cComponent;
  let fixture: ComponentFixture<NgxyzC2cComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxyzC2cComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxyzC2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

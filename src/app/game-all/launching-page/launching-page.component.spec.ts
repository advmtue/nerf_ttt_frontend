import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchingPageComponent } from './launching-page.component';

describe('LaunchingPageComponent', () => {
  let component: LaunchingPageComponent;
  let fixture: ComponentFixture<LaunchingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

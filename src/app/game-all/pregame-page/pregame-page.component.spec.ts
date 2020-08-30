import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregamePageComponent } from './pregame-page.component';

describe('PregamePageComponent', () => {
  let component: PregamePageComponent;
  let fixture: ComponentFixture<PregamePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregamePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

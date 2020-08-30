import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngamePageComponent } from './ingame-page.component';

describe('IngamePageComponent', () => {
  let component: IngamePageComponent;
  let fixture: ComponentFixture<IngamePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngamePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

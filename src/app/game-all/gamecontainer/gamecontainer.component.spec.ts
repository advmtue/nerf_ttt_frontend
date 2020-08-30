import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamecontainerComponent } from './gamecontainer.component';

describe('GamecontainerComponent', () => {
  let component: GamecontainerComponent;
  let fixture: ComponentFixture<GamecontainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamecontainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamecontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

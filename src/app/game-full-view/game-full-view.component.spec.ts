import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFullViewComponent } from './game-full-view.component';

describe('GameFullViewComponent', () => {
  let component: GameFullViewComponent;
  let fixture: ComponentFixture<GameFullViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameFullViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

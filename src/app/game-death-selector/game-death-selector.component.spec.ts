import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDeathSelectorComponent } from './game-death-selector.component';

describe('GameDeathSelectorComponent', () => {
  let component: GameDeathSelectorComponent;
  let fixture: ComponentFixture<GameDeathSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDeathSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDeathSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

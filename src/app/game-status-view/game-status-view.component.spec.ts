import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatusViewComponent } from './game-status-view.component';

describe('GameStatusViewComponent', () => {
  let component: GameStatusViewComponent;
  let fixture: ComponentFixture<GameStatusViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameStatusViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStatusViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

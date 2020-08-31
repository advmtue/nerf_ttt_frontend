import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMetadataViewComponent } from './game-metadata-view.component';

describe('GameMetadataViewComponent', () => {
  let component: GameMetadataViewComponent;
  let fixture: ComponentFixture<GameMetadataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameMetadataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameMetadataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

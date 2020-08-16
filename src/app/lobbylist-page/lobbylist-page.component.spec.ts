import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbylistPageComponent } from './lobbylist-page.component';

describe('LobbylistPageComponent', () => {
  let component: LobbylistPageComponent;
  let fixture: ComponentFixture<LobbylistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbylistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbylistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

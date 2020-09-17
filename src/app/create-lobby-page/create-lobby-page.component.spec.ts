import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLobbyPageComponent } from './create-lobby-page.component';

describe('CreateLobbyPageComponent', () => {
  let component: CreateLobbyPageComponent;
  let fixture: ComponentFixture<CreateLobbyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLobbyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLobbyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

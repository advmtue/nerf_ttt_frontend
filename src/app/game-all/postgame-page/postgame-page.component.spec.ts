import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostgamePageComponent } from './postgame-page.component';

describe('PostgamePageComponent', () => {
  let component: PostgamePageComponent;
  let fixture: ComponentFixture<PostgamePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostgamePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostgamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

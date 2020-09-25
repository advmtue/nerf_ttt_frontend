import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostpendingPageComponent } from './postpending-page.component';

describe('PostpendingPageComponent', () => {
  let component: PostpendingPageComponent;
  let fixture: ComponentFixture<PostpendingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostpendingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostpendingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

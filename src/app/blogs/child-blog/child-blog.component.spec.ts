import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildBlogComponent } from './child-blog.component';

describe('ChildBlogComponent', () => {
  let component: ChildBlogComponent;
  let fixture: ComponentFixture<ChildBlogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChildBlogComponent]
    });
    fixture = TestBed.createComponent(ChildBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

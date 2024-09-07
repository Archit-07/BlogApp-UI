import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlogDialogComponent } from './add-blog-dialog.component';

describe('AddBlogDialogComponent', () => {
  let component: AddBlogDialogComponent;
  let fixture: ComponentFixture<AddBlogDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBlogDialogComponent]
    });
    fixture = TestBed.createComponent(AddBlogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

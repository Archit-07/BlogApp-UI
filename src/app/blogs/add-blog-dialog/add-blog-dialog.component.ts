import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../app/services/auth.service';

@Component({
  selector: 'app-add-blog-dialog',
  templateUrl: './add-blog-dialog.component.html',
  styleUrls: ['./add-blog-dialog.component.scss']
})
export class AddBlogDialogComponent implements OnInit {
  blogName: string = '';
  category: string = '';
  article: string = '';
  authorName: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddBlogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log("this.data", this.data);
    if (this.data) {
      // If data is provided, populate the fields for editing
      this.blogName = this.data.blogName;
      this.category = this.data.category;
      this.article = this.data.article;
      this.authorName = this.data.authorName;
    }
  }

  onSave(): void {
    const updatedBlog = {
      ...this.data, // Use existing data if editing
      blogName: this.blogName,
      category: this.category,
      article: this.article,
      authorName: this.authorName,
    };
    this.dialogRef.close(updatedBlog);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

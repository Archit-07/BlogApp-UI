import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogListComponent } from './blog-list/blog-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChildBlogComponent } from './child-blog/child-blog.component';
import { AddBlogDialogComponent } from './add-blog-dialog/add-blog-dialog.component';

// Angular Material Modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Optional, for icons in the dialog
import { MatTooltipModule } from '@angular/material/tooltip'; // Optional, for tooltips

@NgModule({
  declarations: [
    BlogListComponent,
    ChildBlogComponent,
    AddBlogDialogComponent
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule, // Import MatDialogModule for dialog functionality
    MatFormFieldModule, // Import MatFormFieldModule for form field styling
    MatInputModule, // Import MatInputModule for input fields
    MatButtonModule, // Import MatButtonModule for buttons
    MatIconModule, // Optional: for icons
    MatTooltipModule // Optional: for tooltips
  ]
})
export class BlogsModule { }
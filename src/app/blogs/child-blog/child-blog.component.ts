import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child-blog',
  templateUrl: './child-blog.component.html',
  styleUrls: ['./child-blog.component.scss']
})
export class ChildBlogComponent {
  @Input() blog!: {
    _id: string;
    user: string;
    blogName: string;
    category: string;
    article: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
  };
  @Input() showEditDeleteButtons: boolean = false;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}
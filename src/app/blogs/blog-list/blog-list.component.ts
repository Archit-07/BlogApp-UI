import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddBlogDialogComponent } from '../add-blog-dialog/add-blog-dialog.component';
import { AuthService, Blog } from '../../../app/services/auth.service'; // Import Blog interface
import { Subscription, interval } from 'rxjs'; // Import interval and Subscription

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit, OnDestroy {
  private addBlogDialogRef: MatDialogRef<AddBlogDialogComponent> | null = null;

  @ViewChild('addButton') addButton: ElementRef<HTMLButtonElement> | undefined;

  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  searchQuery: string = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  currentUser: string = ''; // Get the current logged-in user
  showEditDeleteButtons: boolean = false;
  isMyBlogsView: boolean = false; // New flag to track if we're in "My Blogs" view

  refreshSubscription: Subscription | undefined; // For automatic refreshing

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the current user
    const userData = this.authService.getUser();
    this.currentUser = userData.loginId;

    // Fetch blogs initially
    this.fetchBlogs();

    // Set up an interval to fetch blogs every 5 seconds
    this.refreshSubscription = interval(5000).subscribe(() => {
      this.fetchBlogs();
    });
  }

  fetchBlogs(): void {
    this.authService.getAllBlog().subscribe({
      next: (blogs: Blog[]) => {
        this.blogs = blogs;

        // Apply filtering based on "My Blogs" view flag
        if (this.isMyBlogsView) {
          this.filteredBlogs = this.blogs.filter(blog => blog.user === this.currentUser);
        } else {
          this.filteredBlogs = blogs;
        }
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      },
    });
  }

  onSearch(): void {
    const searchQueryLower = this.searchQuery.toLowerCase();

    this.filteredBlogs = this.blogs.filter(blog => {
      const blogDate = new Date(blog.createdAt);

      const matchesSearchQuery = this.searchQuery
        ? blog.blogName.toLowerCase().includes(searchQueryLower) ||
          blog.article.toLowerCase().includes(searchQueryLower) ||
          blog.category.toLowerCase().includes(searchQueryLower)
        : true;

      const matchesDateRange = this.matchesDateRange(blogDate);

      return matchesSearchQuery && matchesDateRange;
    });

    this.showEditDeleteButtons = this.filteredBlogs.every(blog => blog.user === this.currentUser);
  }

  private matchesDateRange(blogDate: Date): boolean {
    const fromDate = this.fromDate ? new Date(this.fromDate) : null;
    const toDate = this.toDate ? new Date(this.toDate) : null;

    return (!fromDate || blogDate >= fromDate) && (!toDate || blogDate <= toDate);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.fromDate = null;
    this.toDate = null;
    this.isMyBlogsView = false; // Reset the "My Blogs" view flag
    this.filteredBlogs = this.blogs;
    this.showEditDeleteButtons = false;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Checks if the token exists
  }

  onAddBlog(): void {
    this.openBlogDialog(); // Pass undefined for adding a new blog
  }

  openBlogDialog(blog?: Blog): void {
    const dialogRef = this.dialog.open(AddBlogDialogComponent, {
      width: '500px',
      data: blog || {},
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (blog) {
          this.authService.updateBlog(result).subscribe(() => {
            const index = this.blogs.findIndex(b => b._id === blog._id);
            if (index > -1) {
              this.blogs[index] = result;
            }
          });
        } else {
          this.authService.addBlog(result).subscribe(() => {
            this.blogs.push(result);
          });
        }
        this.filteredBlogs = this.blogs;
      }
    });
  }

  showMyBlogs(): void {
    this.isMyBlogsView = true; // Set the "My Blogs" view flag
    this.filteredBlogs = this.blogs.filter(blog => blog.user === this.currentUser);
    this.showEditDeleteButtons = true;
  }

  onEdit(blog: Blog): void {
    this.openBlogDialog(blog);
  }

  onDelete(blog: Blog): void {
    this.authService.deleteBlog(blog).subscribe(() => {
      this.blogs = this.blogs.filter(b => b._id !== blog._id);
      this.filteredBlogs = this.blogs;
    });
  }

  // Clear interval when the component is destroyed
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}

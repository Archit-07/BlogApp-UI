import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddBlogDialogComponent } from '../add-blog-dialog/add-blog-dialog.component';
import { AuthService, Blog } from '../../../app/services/auth.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit, OnDestroy {
  @ViewChild('addButton') addButton: ElementRef<HTMLButtonElement> | undefined;

  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  searchQuery: string = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  currentUser: string = ''; 
  showEditDeleteButtons: boolean = false;
  isMyBlogsView: boolean = false; 

  refreshSubscription: Subscription | undefined; 
  autoFetchEnabled: boolean = true; // Flag to control auto-fetching

  private ws: WebSocket | undefined;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUser();
    this.currentUser = userData.loginId;

    this.fetchBlogs();
    this.startAutoFetching();
    this.setupWebSocket();
  }

  startAutoFetching(): void {
    this.refreshSubscription = interval(5000).subscribe(() => {
      if (this.autoFetchEnabled) {
        this.fetchBlogs();
      }
    });
  }

  stopAutoFetching(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  fetchBlogs(): void {
    this.authService.getAllBlog().subscribe({
      next: (blogs: Blog[]) => {
        this.blogs = blogs;
        this.filteredBlogs = this.isMyBlogsView 
          ? this.blogs.filter(blog => blog.user === this.currentUser) 
          : blogs;
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      },
    });
  }

  onSearch(): void {
    this.autoFetchEnabled = false; // Stop auto-fetching while searching
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
    this.isMyBlogsView = false; 
    this.filteredBlogs = this.blogs;
    this.showEditDeleteButtons = false;

    this.autoFetchEnabled = true; // Re-enable auto-fetching after clearing filters
    this.startAutoFetching();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); 
  }

  onAddBlog(): void {
    this.openBlogDialog(); 
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
            this.fetchBlogs(); // Re-fetch blogs to ensure the UI is updated
          });
        } else {
          this.authService.addBlog(result).subscribe(() => {
            this.fetchBlogs(); // Re-fetch blogs to ensure the UI is updated
          });
        }
      }
    });
  }

  showMyBlogs(): void {
    this.isMyBlogsView = true; 
    this.filteredBlogs = this.blogs.filter(blog => blog.user === this.currentUser);
    this.showEditDeleteButtons = true;
  }

  onEdit(blog: Blog): void {
    this.openBlogDialog(blog);
  }

  onDelete(blog: Blog): void {
    this.authService.deleteBlog(blog).subscribe(() => {
      this.fetchBlogs(); // Re-fetch blogs to ensure the UI is updated
    });
  }

  private setupWebSocket(): void {
    this.ws = new WebSocket('ws://localhost:8080');
  
    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };
  
    this.ws.onmessage = (event) => {
      console.log('Message received from WebSocket:', event.data);
      try {
        const blog: Blog = JSON.parse(event.data);
        console.log('Parsed blog data:', blog);
        // Optionally, you can process the blog data directly
        // For example, update the local blog list to be implemented
        this.fetchBlogs();
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };
  
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  ngOnDestroy(): void {
    this.stopAutoFetching();
    if (this.ws) {
      this.ws.close();
    }
  }
}

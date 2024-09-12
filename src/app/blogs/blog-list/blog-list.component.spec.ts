import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { BlogListComponent } from './blog-list.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../app/services/auth.service';
import { of, throwError, Subscription, Subject } from 'rxjs';

fdescribe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;
  let authServiceMock: any;
  let matDialogMock: any;
  let dialogRefMock: any;
  
  const mockBlogs = [
    {
      _id: '1',
      user: 'user1',
      blogName: 'Blog 1',
      category: 'Category 1',
      article: 'Article 1',
      authorName: 'Author 1',
      createdAt: '2024-09-10T00:00:00.000Z',
      updatedAt: '2024-09-10T00:00:00.000Z',
    },
    {
      _id: '2',
      user: 'user2',
      blogName: 'Blog 2',
      category: 'Category 2',
      article: 'Article 2',
      authorName: 'Author 2',
      createdAt: '2024-09-11T00:00:00.000Z',
      updatedAt: '2024-09-11T00:00:00.000Z',
    },
  ];

  beforeEach(async () => {
    dialogRefMock = {
      afterClosed: () => new Subject<any>().asObservable()
    };

    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogMock.open.and.returnValue(dialogRefMock);

    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getAllBlog',
      'getUser',
      'isLoggedIn',
      'addBlog',
      'updateBlog',
      'deleteBlog',
    ]);

    await TestBed.configureTestingModule({
      declarations: [BlogListComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch blogs and start auto-fetching', fakeAsync(() => {
      authServiceMock.getUser.and.returnValue({ loginId: 'user1' });
      authServiceMock.getAllBlog.and.returnValue(of(mockBlogs));

      component.ngOnInit();
      tick(); // Simulate passage of time
      flush(); // Clear any remaining timers

      expect(authServiceMock.getAllBlog).toHaveBeenCalled();
      expect(component.blogs).toEqual(mockBlogs);
      expect(component.filteredBlogs).toEqual(mockBlogs);
      expect(component.currentUser).toEqual('user1');

      component.ngOnDestroy(); // Cleanup to stop intervals
    }));
  });

  describe('fetchBlogs', () => {
    it('should fetch blogs successfully', () => {
      authServiceMock.getAllBlog.and.returnValue(of(mockBlogs));

      component.fetchBlogs();

      expect(authServiceMock.getAllBlog).toHaveBeenCalled();
      expect(component.blogs).toEqual(mockBlogs);
      expect(component.filteredBlogs).toEqual(mockBlogs);
    });

    it('should handle error while fetching blogs', () => {
      const consoleSpy = spyOn(console, 'error');
      authServiceMock.getAllBlog.and.returnValue(throwError(() => new Error('Failed to fetch blogs')));

      component.fetchBlogs();

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching blogs:', jasmine.any(Error));
    });
  });

  describe('onSearch', () => {
    it('should filter blogs by search query', () => {
      component.blogs = mockBlogs;
      component.searchQuery = 'Blog 1';

      component.onSearch();

      expect(component.filteredBlogs.length).toBe(1);
      expect(component.filteredBlogs[0].blogName).toBe('Blog 1');
    });

    it('should show edit/delete buttons if all filtered blogs belong to current user', () => {
      component.currentUser = 'user1';
      component.blogs = mockBlogs;
      component.searchQuery = 'Blog 1';

      component.onSearch();

      expect(component.showEditDeleteButtons).toBeTrue();
    });
  });

  describe('onAddBlog', () => {
    it('should open AddBlogDialogComponent on add blog', () => {
      component.onAddBlog();

      expect(matDialogMock.open).toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should delete the blog and refresh blogs', () => {
      authServiceMock.deleteBlog.and.returnValue(of({}));
      authServiceMock.getAllBlog.and.returnValue(of(mockBlogs));

      component.onDelete(mockBlogs[0]);

      expect(authServiceMock.deleteBlog).toHaveBeenCalledWith(mockBlogs[0]);
      expect(authServiceMock.getAllBlog).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { AuthService } from './services/auth.service';
import { AppComponent } from './app.component';

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routerMock.url = '/blogs'; // Default URL for router mock

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule], // Import RouterTestingModule
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  describe('isLoggedIn', () => {
    it('should return the result of authService.isLoggedIn()', () => {
      authServiceMock.isLoggedIn.and.returnValue(true);

      expect(component.isLoggedIn()).toBe(true);

      authServiceMock.isLoggedIn.and.returnValue(false);

      expect(component.isLoggedIn()).toBe(false);
    });
  });

  describe('isBlogsPage', () => {
    it('should return true if the current route is /blogs', () => {
      routerMock.url = '/blogs'; // Set URL to /blogs
      expect(component.isBlogsPage()).toBe(true);
    });

    it('should return false if the current route is not /blogs', () => {
      routerMock.url = '/other-page'; // Set URL to a different route
      expect(component.isBlogsPage()).toBe(false);
    });
  });

  describe('onLogout', () => {
    it('should call authService.logout() and navigate to /users/login', () => {
      component.onLogout();
      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/users/login']);
    });
  });

  describe('onLogin', () => {
    it('should navigate to /users/login', () => {
      component.onLogin();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/users/login']);
    });
  });
});

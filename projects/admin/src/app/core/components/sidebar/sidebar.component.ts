import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgAuthService } from '../../../../../../study-angular/src/lib/db/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isShow: boolean = true;
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;

  navs = [
    {
      icon: 'newspaper',
      text: '사업자 관리',
      path: '/news',
    },
    {
      icon: 'article',
      text: '파트너 관리',
      path: '/notice',
    },
    {
      icon: 'videocam',
      text: '업무관리',
      path: '/video',
    },
    {
      icon: 'upload_file',
      text: '매니저 관리',
      path: '/download',
    },
  ];

  constructor(private router: Router, private authService: NgAuthService) {}

  logout(): void {
    this.authService.logout().subscribe(() => {
      //this.isLoggedIn$ = of(false);
      //this.router.navigate(['auth/login']);
    });
  }
}

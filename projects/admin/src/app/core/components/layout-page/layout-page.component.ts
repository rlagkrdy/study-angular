import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgAuthService } from '../../../../../../study-angular/src/lib/db/auth/auth.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss'],
})
export class LayoutPageComponent implements OnInit {
  isIconNav = false;

  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;


  constructor(private router: Router, private authService: NgAuthService) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']).then(() => {
        window.location.reload();
      });
    });
  }

  sideBar(url: string) {}

  toggleIconNav(): void {
    this.isIconNav = !this.isIconNav;
  }
}

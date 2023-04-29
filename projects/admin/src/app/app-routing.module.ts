import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './core/components/layout-page/layout-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: '',
    component: LayoutPageComponent,
    // canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: 'notice',
        loadChildren: () =>
          import('./pages/notice-page/notice-page.module').then(
            (m) => m.NoticePageModule
          ),
        data: { title: '공지사항' },
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth-page/auth-page.module').then(
        (m) => m.AuthPageModule
      ),
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

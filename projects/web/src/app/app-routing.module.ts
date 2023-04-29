import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutPageComponent } from "./layout/components/layout-page/layout-page.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutPageComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "index" },
      {
        path: "index",
        loadChildren: () =>
          import("./pages/index-page/index-page.module").then(
            (m) => m.IndexPageModule
          ),
      },
    ],
  },
  { path: "**", redirectTo: "index" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: "enabled",
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

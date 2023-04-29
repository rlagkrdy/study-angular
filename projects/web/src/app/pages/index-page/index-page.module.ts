import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IndexPageComponent } from "./components/index-page/index-page.component";
import { IndexPageRoutingModule } from "./index-page-routing.module";

@NgModule({
  declarations: [IndexPageComponent],
  imports: [CommonModule, IndexPageRoutingModule],
})
export class IndexPageModule {}

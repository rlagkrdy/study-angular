import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileImageComponent } from "./components/profile-image/profile-image.component";
import { LibSharedModule } from "../../shared/shared.module";
import { ThumbnailImageComponent } from "./components/thumbnail-image/thumbnail-image.component";

@NgModule({
  declarations: [ProfileImageComponent, ThumbnailImageComponent],
  exports: [ProfileImageComponent, ThumbnailImageComponent],
  imports: [CommonModule, LibSharedModule],
})
export class LibProfileModule {}

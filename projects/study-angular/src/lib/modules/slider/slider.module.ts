import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSliderComponent } from './components/custom-slider/custom-slider.component';
import { SwiperModule } from 'swiper/angular';
import { ContentChildDirective } from './components/directives/content-child.directive';
import { LibSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CustomSliderComponent, ContentChildDirective],
  exports: [CustomSliderComponent, ContentChildDirective],
  imports: [CommonModule, SwiperModule, LibSharedModule],
})
export class LibSliderModule {}

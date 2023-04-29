import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import SwiperCore, {
  Autoplay,
  Pagination,
  Swiper,
  SwiperOptions,
  Zoom,
  Navigation,
} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { ContentChildDirective } from '../directives/content-child.directive';
SwiperCore.use([Zoom, Pagination, Autoplay, Navigation]);

@Component({
  selector: 'lib-custom-slider',
  templateUrl: './custom-slider.component.html',
  styleUrls: ['./custom-slider.component.scss'],
})
export class CustomSliderComponent implements AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;
  @ContentChildren(ContentChildDirective, { descendants: true })
  slidesEl: QueryList<ContentChildDirective> | undefined;

  @Input() config: SwiperOptions;

  @Output() onSwiper = new EventEmitter<any>();
  @Output() onSlideChange = new EventEmitter<Swiper[]>();

  constructor() {}

  ngAfterViewInit() {}

  slideNext() {
    this.swiper.swiperRef.slideNext();
  }
  slidePrev() {
    this.swiper.swiperRef.slidePrev();
  }
}

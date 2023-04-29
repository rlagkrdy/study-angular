import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Album,
  checkIsVideo,
} from '../../../../../../../../src/entities/album/types';
import { NgAlbumService } from '../../../../db/album/album.service';
import { SubscriptionBaseComponent } from '../../../../core/base-components/subscription-base.component';
import { switchMap, tap } from 'rxjs';
import { NgBottomSheetService } from '../../../bottom-sheet/services/bottom-sheet.service';
import { EventEndControllerComponent } from '../../../../../../../app/src/app/modules/bottom-sheet/components/event-end-controller/event-end-controller.component';
import { filter } from 'rxjs/operators';
import { InfinityList } from '../../../../core/types';
import { SwiperOptions, Swiper } from 'swiper';

@Component({
  selector: 'lib-thumbnail-dialog',
  templateUrl: './thumbnail-dialog.component.html',
  styleUrls: ['./thumbnail-dialog.component.scss'],
})
export class ThumbnailDialogComponent
  extends SubscriptionBaseComponent
  implements OnInit
{
  @ViewChildren('video') videoChildren: QueryList<ElementRef>;

  album: Album;
  parentId;
  isMy: boolean;
  initAlbum: Album;
  albums: Album[] = [];
  infinityList: InfinityList<Album>;
  hasMore: boolean;
  currentIndex: number;
  isLoading: boolean = false;

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 16,
    zoom: {
      minRatio: 1,
      maxRatio: 3,
    },
    navigation: {
      nextEl: '.right-button',
      prevEl: '.left-button',
    },
  };

  private swiper: Swiper;
  checkIsVideo = checkIsVideo;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ThumbnailDialogComponent>,
    private albumService: NgAlbumService,
    private bottomSheetService: NgBottomSheetService
  ) {
    super();

    this.infinityList = this.data.infinityList;
    this.currentIndex = this.data.currentIndex;
    this.album = this.data.album;
    this.initAlbum = this.data.album;
    this.parentId = this.data.petId;
    this.isMy = this.data.isMy;
  }

  ngOnInit(): void {
    console.log(this.album.type);
    this.setObservable(
      'albums',
      'albums',
      this.infinityList.valueChange.pipe(tap(() => (this.isLoading = false)))
    );
    this.setObservable('hasMore', 'hasMore', this.infinityList.hasMoreChange);
  }

  initSwiper(swiper: Swiper): void {
    this.swiper = swiper;
    this.swiper.slideTo(this.currentIndex);

    this.more();
  }

  onSlideChange(swipes: Swiper[]): void {
    const swiper = swipes[0];
    const direction = swiper['swipeDirection'];

    this.album = this.albums[this.swiper.activeIndex];
    if (direction === 'next') {
      this.more();
    }

    if (this.videoChildren.length > 0) {
      this.videoChildren.forEach((videoElementRef: ElementRef) => {
        (videoElementRef.nativeElement as HTMLVideoElement).pause();
      });
    }
  }

  openBottomSheet(): void {
    if (this.albums.length < 0) {
      this.album = this.initAlbum;
    }

    this.bottomSheetService
      .open(EventEndControllerComponent)
      .afterDismissed()
      .pipe(
        filter((value) => value === 'remove'),
        switchMap(() =>
          this.albumService.delete(this.album.id, {
            parentIds: [this.parentId],
          })
        )
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  private more(): void {
    if (
      this.albums.length - this.currentIndex <= 5 &&
      this.hasMore &&
      !this.isLoading
    ) {
      this.isLoading = true;
      this.infinityList.more();
    }
  }
}

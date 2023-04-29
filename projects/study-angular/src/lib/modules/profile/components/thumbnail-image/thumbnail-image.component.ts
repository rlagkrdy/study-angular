import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-thumbnail-image',
  templateUrl: './thumbnail-image.component.html',
  styleUrls: ['./thumbnail-image.component.scss'],
})
export class ThumbnailImageComponent implements OnInit {
  @Input() url: string;
  @Input() isUpload: boolean = false;
  @Input() isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}

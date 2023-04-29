import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
})
export class ProfileImageComponent implements OnInit {
  @Input() url: string;
  @Input() isUpload: boolean = false;
  @Input() isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}

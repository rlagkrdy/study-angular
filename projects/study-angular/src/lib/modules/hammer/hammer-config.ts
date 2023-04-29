import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { DIRECTION_ALL } from 'hammerjs';

@Injectable({
  providedIn: 'root',
})
export class HammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    pan: { direction: DIRECTION_ALL },
    swipe: { direction: DIRECTION_ALL },
  };

  constructor() {
    super();
  }
}

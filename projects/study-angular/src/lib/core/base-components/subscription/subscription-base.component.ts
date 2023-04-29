import { Directive, OnDestroy } from '@angular/core';
import { SubscriptionBaseService } from '../../base-services/subscription-base.service';

@Directive()
export abstract class SubscriptionBaseComponent
  extends SubscriptionBaseService
  implements OnDestroy
{
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

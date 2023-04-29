import { Subscription, Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ColdObservable, HashMap, ObservableOnce } from '../types';
import { generateId } from '../utils';

export interface SubscriptionOutput<T = any> {
  name: string;
  valueChange?: ColdObservable<T>;
  subscription: Subscription;
}

export type SingletonObservableFactory<T> = () => Observable<T>;

export abstract class SubscriptionBaseService {
  protected subjectMap: HashMap<BehaviorSubject<any>> = {};
  protected subscriptionMap: HashMap<Subscription> = {};
  protected subscription: Subscription = new Subscription();
  protected valueMap: HashMap<any> = {};

  private waitingSubjectsMap: HashMap<Subject<void>[]> = {};

  addSubscription(subscription: Subscription): SubscriptionOutput {
    const name = generateId(4);

    if (this.subscriptionMap[name]) {
      return this.addSubscription(subscription);
    }

    return this.setSubscription(name, subscription);
  }

  setSubscription(
    name: string,
    subscription: Subscription
  ): SubscriptionOutput {
    if (this.subscriptionMap[name]) {
      this.subscriptionMap[name].unsubscribe();
    }

    this.subscriptionMap[name] = this.subscription.add(subscription) as any;

    return { name, subscription: this.subscriptionMap[name] };
  }

  makeSingletonSubscription<T>(
    name: string,
    observable: Observable<T>
  ): SubscriptionOutput<T> {
    if (
      this.subjectMap[name] &&
      this.subjectMap[name].getValue() !== undefined
    ) {
      return {
        name,
        valueChange: this.subjectMap[name].asObservable(),
        subscription: this.subscriptionMap[name],
      };
    }

    if (!this.subjectMap[name]) {
      this.subjectMap[name] = new BehaviorSubject<T>(undefined as any);
    }

    const subject = new Subject<void>();

    if (this.waitingSubjectsMap[name]) {
      this.waitingSubjectsMap[name].push(subject);
    } else {
      this.waitingSubjectsMap[name] = [subject];
    }

    if (!this.subscriptionMap[name]) {
      this.subscriptionMap[name] = this.subscription.add(
        observable.subscribe(
          (value) => {
            this.subjectMap[name].next(value);

            for (const s of this.waitingSubjectsMap[name]) {
              s.next();
              s.complete();
            }
          },
          (err) => this.subjectMap[name].error(err),
          () => this.subjectMap[name].complete()
        )
      ) as any;
    }

    return {
      name,
      valueChange: subject
        .asObservable()
        .pipe(switchMap(() => this.subjectMap[name].asObservable())),
      subscription: this.subscriptionMap[name],
    };
  }

  makeSingletonValue<T>(
    name: string,
    observable: ObservableOnce<T>
  ): ObservableOnce<T> {
    if (this.valueMap[name] !== undefined) {
      return of(this.valueMap[name]);
    }

    return observable.pipe(tap((value) => (this.valueMap[name] = value)));
  }

  removeSubscription(name: string): void {
    if (this.subscriptionMap[name]) {
      this.subscription.remove(this.subscriptionMap[name]);
      this.subscriptionMap[name].unsubscribe();
      delete this.subscriptionMap[name];
    }
  }

  initObservable<T>(
    key: keyof this,
    observable: Observable<T>
  ): SubscriptionOutput {
    return this.addSubscription(
      observable.subscribe((data) => (this[key] = data as any))
    );
  }

  setObservable<T>(
    name: string,
    key: keyof this,
    observable: Observable<T>
  ): SubscriptionOutput {
    return this.setSubscription(
      name,
      observable.subscribe((data) => (this[key] = data as any))
    );
  }
}

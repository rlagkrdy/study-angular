import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from "@angular/core";
import { NavigationStart, Router, RouterEvent } from "@angular/router";
import { SubscriptionBaseComponent } from "../../../../../../cntech/src/lib/core/base-components/subscription/subscription-base.component";
import {
  BehaviorSubject,
  combineLatest,
  filter,
  fromEvent,
  map,
  startWith,
  Subscription,
} from "rxjs";
import { ScrollTrigger } from "gsap/ScrollTrigger";

@Component({
  selector: "cn-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent
  extends SubscriptionBaseComponent
  implements OnInit
{
  isTransParentPage$ = new BehaviorSubject<boolean>(false);
  isScrolled$ = new BehaviorSubject<boolean>(false);
  isHover$ = new BehaviorSubject<boolean>(false);

  isTransparent = true;
  isOpen = false;

  isMenuOpen = false;
  isMenuOpen$ = new BehaviorSubject<boolean>(false);

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.addSubscription(this.initIsTransParentPage());
    this.initIsScrolled();
    this.addSubscription(this.initIsTransparent());
    this.addSubscription(this.initMenuEvent());
    this.addSubscription(this.initIsOpenMenuChange());
  }

  private initMenuEvent(): Subscription {
    return fromEvent(
      document.querySelector(".toolbar-mobile-menu-box"),
      "click"
    ).subscribe((e: Event) => {
      const target: HTMLElement = e.target as HTMLElement;

      if (target.classList.contains("toolbar-child-menu-toggle")) {
        target.parentElement.classList.toggle("active");
      }

      if (target.classList.contains("toolbar-close-link")) {
        this.isMenuOpen$.next(false);
      }
    });
  }

  private initIsOpenMenuChange(): Subscription {
    return this.isMenuOpen$.subscribe((isMenuOpen) => {
      if (isMenuOpen) {
        document.body.classList.add("open__menu");
      } else {
        document.body.classList.remove("open__menu");
      }

      this.isMenuOpen = isMenuOpen;
      this.cdr.detectChanges();
    });
  }

  changeLanguage(language: string) {
    alert("Coming soon!");
  }

  openMenu(): void {
    this.isMenuOpen$.next(true);
  }

  private checkIsTransparent(url: string, windowWidth: number): boolean {
    if (url.startsWith("/index")) {
      return true;
    }

    if (windowWidth > 1280) {
      return (
        url.startsWith("/solution/asset-management") ||
        url.startsWith("/solution/smart-building") ||
        url.startsWith("/solution/smart-factory") ||
        url.startsWith("/iot/cn102") ||
        url.startsWith("/iot/ara1") ||
        url.startsWith("/iot/iron")
      );
    }

    return false;
  }

  private initIsTransParentPage() {
    return combineLatest([
      this.router.events.pipe(
        filter((e: RouterEvent) => e instanceof NavigationStart),
        map((e) => e.url),
        startWith(this.router.url)
      ),
      fromEvent(window, "resize").pipe(
        map(() => window.innerWidth),
        startWith(window.innerWidth)
      ),
    ]).subscribe(([url, windowWidth]: [string, number]) => {
      this.isTransParentPage$.next(this.checkIsTransparent(url, windowWidth));
    });
  }

  private initIsScrolled() {
    ScrollTrigger.create({
      start: 400,
      end: 99999,
      onToggle: (e) => {
        this.isScrolled$.next(e.direction === 1);
      },
    });
  }

  private initIsTransparent() {
    return combineLatest([
      this.isHover$,
      this.isTransParentPage$,
      this.isScrolled$,
    ]).subscribe((result: [boolean, boolean, boolean]) => {
      const [isHover, isTransParentPage, isScrolled] = result;

      this.isOpen = isHover;

      if (!isTransParentPage || isHover) {
        this.isTransparent = false;
        this.cdr.detectChanges();
        return;
      }

      this.isTransparent = !(isTransParentPage && isScrolled);

      this.cdr.detectChanges();
    });
  }
}

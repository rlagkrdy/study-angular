import { Component, OnInit } from "@angular/core";
import { ScrollTrigger } from "gsap/ScrollTrigger";

@Component({
  selector: "cn-layout-page",
  templateUrl: "./layout-page.component.html",
  styleUrls: ["./layout-page.component.scss"],
})
export class LayoutPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      toggleClass: {
        className: "toolbar-box--scrolled",
        targets: ".toolbar-box",
      },
    });
  }
}

import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import { GSDevTools } from "gsap/GSDevTools";
// import { SplitText } from "gsap/SplitText";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// import { MotionPathHelper } from "gsap/MotionPathHelper";
// import { CustomEase } from "gsap/CustomEase";
// import { ScrollSmoother } from "gsap/ScrollSmoother";

import { $, $$, cssVal, scaleClip, spOnly } from "./_global.js";
gsap
  .registerPlugin
  // ScrollTrigger,
  // DrawSVGPlugin,
  // ScrollToPlugin,
  // GSDevTools,
  // SplitText,
  // MotionPathPlugin,
  // MotionPathHelper,
  // CustomEase
  // ScrollSmoother
  ();

export default class App {
  constructor() {}
  init() {
    console.log("common file loaded");
    // ScrollTrigger.config({
    //   ignoreMobileResize: true,
    // });
    // this.scrollSettings();
  }
  scrollSettings() {
    if (spOnly) return;
    console.log("scrollSettings");
    window.scrollSmootherBody = ScrollSmoother.create({
      ease: "expo.out",
      wrapper: ".l-content",
      content: ".p-index",
      smooth: 0.5,
      effects: true,
      smoothTouch: 0.1,
      normalizeScroll: false,
      ignoreMobileResize: true,
    });
    ScrollTrigger.refresh();
  }
}

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import { GSDevTools } from "gsap/GSDevTools";
// import { SplitText } from "gsap/SplitText";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// import { MotionPathHelper } from "gsap/MotionPathHelper";
// import { CustomEase } from "gsap/CustomEase";
import { $, $$, cssVal, scaleClip, spOnly } from "./_global.js";
gsap.registerPlugin(
  ScrollTrigger
  // DrawSVGPlugin,
  // ScrollToPlugin,
  // GSDevTools,
  // SplitText,
  // MotionPathPlugin,
  // MotionPathHelper,
  // CustomEase
);

export default class App {
  constructor() {}
  init() {
    this.headerChangeColor();

    // parts direction
    this.gradButtonEnter();
  }
  headerChangeColor() {
    const headerBottom = $(".base-header").getBoundingClientRect().bottom;
    $$("[black-cover]").forEach((el) => {
      console.log(el);
      ScrollTrigger.create({
        trigger: el,
        end: `bottom top+=${headerBottom}`,
        onEnter: () => $(".base-header").setAttribute("header-white", ""),
        onLeave: () => $(".base-header").removeAttribute("header-white"),
        onEnterBack: () => $(".base-header").setAttribute("header-white", ""),
        onLeaveBack: () => $(".base-header").removeAttribute("header-white"),
      });
    });
  }
  gradButtonEnter() {
    $$("[grad-button]").forEach((el) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(el, {
        startAt: {
          "--start": "-150%",
          "--middle": "-100%",
          "--end": "-0%",
        },
        duration: 1.2,
        ease: "power2",
        "--start": "100%",
        "--middle": "200%",
        "--end": "250%",
      });
      el.addEventListener("mouseenter", () => {
        tl.play();
      });
      el.addEventListener("mouseleave", () => {
        tl.reverse();
      });
    });
  }
}

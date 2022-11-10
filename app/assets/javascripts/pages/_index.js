import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import { GSDevTools } from "gsap/GSDevTools";
// import { SplitText } from "gsap/SplitText";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// import { MotionPathHelper } from "gsap/MotionPathHelper";
import { CustomEase } from "gsap/CustomEase";
import { $, $$, cssVal, scaleClip, spOnly } from "../_global.js";
gsap.registerPlugin(
  ScrollTrigger,
  // DrawSVGPlugin,
  // ScrollToPlugin,
  // GSDevTools,
  // SplitText,
  // MotionPathPlugin,
  // MotionPathHelper,
  CustomEase
);

export default class App {
  constructor() {}
  init() {
    this.firstScrollPartsDirection();
    this.reviewDirection();
  }
  firstScrollPartsDirection() {
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
    });
    tl.set(".first__scroll__bar-child", {
      y: "-100%",
    });
    tl.to(".first__scroll__bar-child", {
      y: "0%",
      duration: 0.3,
    });
    tl.to(
      ".first__scroll__bar-child",
      {
        y: "178rem",
        duration: 2,
        ease: "expo.inOut",
      },
      "child"
    );
    tl.to(
      ".first__scroll__text span",
      {
        y: "100%",
        duration: 1,
        ease: CustomEase.create(
          "custom",
          "M0,0,C0.068,0,0.147,0.033,0.188,0.06,0.281,0.12,0.319,0.302,0.351,0.512,0.385,0.74,0.439,0.89,0.493,0.938,0.532,0.972,0.698,1,1,1"
        ),
      },
      "child+=0.5"
    );
  }
  reviewDirection() {
    // スクロールの動き
    const boxHeight = $(".review__scrollbar__box").getBoundingClientRect().height;
    const thumbHeight = $(".review__scrollbar__thumb").getBoundingClientRect().height;
    console.log(boxHeight, thumbHeight);
    const tl = gsap.timeline();
    tl.to(".review__scrollbar__thumb", {
      y: boxHeight - thumbHeight,
      ease: "none",
    });

    const wrapScroll = ScrollTrigger.create({
      trigger: ".review__list",
      scrub: true,
      scroller: ".review__list-wrap",
      start: "top top",
      end: "bottom bottom",
      animation: tl,
    });

    // 開く時の動作
    const reviewItem = $$(".review__item");
    reviewItem.forEach((item) => {
      const mainHeight = $(".review__item__body-main").getBoundingClientRect().height;
      console.log(mainHeight);
      const tl = gsap.timeline();
      tl.set(item, {
        "--height": mainHeight + "px",
      });
      tl.set($(".review__item__body-main", item), {
        maxHeight: 0 + "px",
      });

      item.addEventListener("click", () => {
        item.toggleAttribute("item-open");
        setTimeout(() => {
          wrapScroll.refresh();
        }, 600);
      });
    });
  }
}

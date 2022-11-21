import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { GSDevTools } from "gsap/GSDevTools";
import { SplitText } from "gsap/SplitText";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// import { MotionPathHelper } from "gsap/MotionPathHelper";
import { CustomEase } from "gsap/CustomEase";
import { $, $$, cssVal, scaleClip, spOnly, randomId } from "../_global.js";
gsap.registerPlugin(
  ScrollTrigger,
  // DrawSVGPlugin,
  // ScrollToPlugin,
  GSDevTools,
  SplitText,
  // MotionPathPlugin,
  // MotionPathHelper,
  CustomEase
);

export default class App {
  constructor() {}
  init() {
    // section direction
    this.firstDrection();
    this.reviewDirection();
  }
  firstDrection() {
    this.firstScrollPartsDirection();
    this.firstSlide();
    // first section pallax
    gsap.to(".first__info, .first__visual", {
      startAt: {
        y: 0,
        opacity: 1,
      },
      y: 300,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: ".first",
        scrub: true,
        start: "top top",
        end: "bottom top",
      },
    });
  }
  firstScrollPartsDirection() {
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.2,
    });
    tl.set(".first__scroll__bar-child", {
      y: "-10rem",
    });
    // tl.to(".first__scroll__bar-child", {
    //   y: "-10rem",
    //   duration: 0.1,
    // });
    tl.to(
      ".first__scroll__bar-child",
      {
        y: "200rem",
        duration: 3,
        ease: "expo.inOut",
      },
      "child"
    );
    // tl.to(
    //   ".first__scroll__text span",
    //   {
    //     y: "100%",
    //     duration: 1,
    //     ease: CustomEase.create(
    //       "custom",
    //       "M0,0,C0.068,0,0.147,0.033,0.188,0.06,0.281,0.12,0.319,0.302,0.351,0.512,0.385,0.74,0.439,0.89,0.493,0.938,0.532,0.972,0.698,1,1,1"
    //     ),
    //   },
    //   "child+=0.5"
    // );
  }
  firstSlide() {
    $$(".first__key-item__title").forEach((el) => {
      // console.log(el);
      new SplitText(el, {
        type: "lines",
        tag: "span",
        linesClass: "first__key-item__title--line",
      });
    });

    // set
    const firstItem = ".first__key:not(:first-child)";
    gsap.set(firstItem, {
      opacity: 0,
    });
    gsap.registerEffect({
      name: "hideText",
      effect: (targets, config) => {
        return gsap.set(targets, {
          display: "inline-block",
          y: "100%",
          clipPath: "inset(0 0 100% 0)",
        });
      },
    });
    // gsap.set(firstItem, {
    //   pointerEvents: "none",
    // });
    gsap.effects.hideText(`${firstItem} .first__key-item__lead`);
    gsap.effects.hideText(`${firstItem} .first__key-item__title--line`);
    gsap.effects.hideText(`${firstItem} .first__key-item__sub`);
    // gsap.set(`${firstItem} .first__key-link`, {
    //   scale: 0.7,
    //   opacity: 0,
    // });

    // animation
    // const tl = gsap.timeline({});
    // console.log(randomId());
    const keyArray = $$(".first__key");
    const barArray = $$(".first__progress__item-child");
    const imageArray = $$(".first__visual__image");
    const slideTl = Array.from(keyArray).map((key, index) => {
      const tl = gsap.timeline();
      const nextKey = keyArray[index + 1] ? keyArray[index + 1] : keyArray[0];
      const nextImage = imageArray[index + 1] ? imageArray[index + 1] : imageArray[0];
      const firstTextEl = [
        ...$$(".first__key-item__lead", key),
        ...$$(".first__key-item__title--line", key),
        ...$$(".first__key-item__sub", key),
      ];
      const nextFirstTextEl = [
        ...$$(".first__key-item__lead", nextKey),
        ...$$(".first__key-item__title--line", nextKey),
        ...$$(".first__key-item__sub", nextKey),
      ];

      tl.call(() => {
        console.log(index);
      });

      // progress delay
      tl.to(barArray[index], {
        duration: 3, // ここでスライドの待ち時間を調整
        clipPath: "inset(0 0% 0 0%)",
      });
      // hide
      tl.set(firstTextEl, {
        clipPath: "inset(0% 0 0 0)",
        y: "0%",
        delay: 0,
      });
      tl.to(
        barArray[index],
        {
          duration: 0.5,
          clipPath: "inset(0 0% 0 100%)",
        },
        "hide"
      );
      tl.to(
        firstTextEl,
        {
          clipPath: "inset(100% 0 0 0)",
          y: "-100%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.2,
        },
        "hide"
      );

      tl.to(
        $(".first__key-link", key),
        {
          opacity: 0,
          duration: 1,
        },
        "hide"
      );

      // show
      tl.call(() => {
        $$(".first__key").forEach((el) => (el.style.pointerEvents = "none"));
        nextKey.style.pointerEvents = "auto";
      });

      tl.set(nextFirstTextEl, {
        clipPath: "inset(0 0 100% 0)",
        y: "100%",
      });
      tl.to(
        nextKey,
        {
          opacity: 1,
          duration: 1,
        },
        "show"
      );
      tl.to(
        nextFirstTextEl,
        {
          clipPath: "inset(0 0 0% 0)",
          y: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.2,
        },
        "show"
      );
      tl.to(
        $(".first__key-link", nextKey),
        {
          startAt: {
            scale: 1.1,
          },
          opacity: 1,
          scale: 1,
          duration: 1,
        },
        "show"
      );
      // count
      const countHeight = $(".first__progress__count-big span").getBoundingClientRect().height;
      tl.to(
        ".first__progress__count-big",
        {
          y: -countHeight * (index + 1),
          duration: 1,
          ease: "power4.out",
        },
        "show"
      );

      // image fadein
      tl.to(
        nextImage,
        {
          startAt: {
            opacity: 0,
            scale: 1.2,
            zIndex: 10,
          },
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: "power2.out",
        },
        "show"
      );
      tl.set(nextImage, {
        zIndex: 9,
      });

      return tl;
    });

    const tl = gsap.timeline({
      repeat: -1,
    });

    tl.add(slideTl[0]);
    tl.add(slideTl[1]);
    tl.add(slideTl[2]);

    // slideTl[0].play();
    // GSDevTools.create({
    //   animation: tl,
    // });
  }
  reviewDirection() {
    // スクロールの動き
    const boxHeight = $(".review__scrollbar__box").getBoundingClientRect().height;
    const thumbHeight = $(".review__scrollbar__thumb").getBoundingClientRect().height;
    // console.log(boxHeight, thumbHeight);
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
      // console.log(mainHeight);
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

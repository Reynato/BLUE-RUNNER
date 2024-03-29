import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import { GSDevTools } from "gsap/GSDevTools";
// import { SplitText } from "gsap/SplitText";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// import { MotionPathHelper } from "gsap/MotionPathHelper";
// import { CustomEase } from "gsap/CustomEase";
import { $, $$, scaleClip, spOnly, oneLineSplit } from "../_global.js";

gsap.registerPlugin(
  ScrollTrigger
  // DrawSVGPlugin,
  // ScrollToPlugin,
  // GSDevTools,
  // SplitText
  // MotionPathPlugin,
  // MotionPathHelper,
  // CustomEase
);

export default class App {
  constructor() {}
  init() {}
}

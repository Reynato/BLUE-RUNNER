import lottie from "lottie-web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { GSDevTools } from "gsap/GSDevTools";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { $, $$, cssVal, spView } from "../global.js";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, ScrollToPlugin, GSDevTools, SplitText, MorphSVGPlugin, CustomEase);

class App {
  constructor() {}
}

export default () => {
  new App();
};

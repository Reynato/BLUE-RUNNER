// ua
const ua = window.navigator.userAgent.toLowerCase();

export const is_edge = ua.indexOf("edge") !== -1;
export const is_ie =
  !is_edge &&
  (ua.indexOf("iemobile") !== -1 ||
    ua.indexOf("trident/7") !== -1 ||
    (ua.indexOf("msie") !== -1 && ua.indexOf("opera") === -1));

export const is_ios =
  ua.indexOf("iphone") >= 0 || ua.indexOf("ipad") >= 0 || ua.indexOf("ipod") >= 0;

// can use observer
export const isCanUseObserver = typeof IntersectionObserver === "function" ? true : false;

// touch device?
export const isTouchDevice = window.ontouchstart === null ? true : false;

// scroll stop & restart
let scroll_top;

export function stopBodyScroll() {
  scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
  document.body.style.position = "fixed";
  document.body.style.top = -scroll_top + "px";
}

export function restartBodyScroll() {
  document.body.style.position = "static";
  document.body.style.top = 0;
  window.scrollTo(0, scroll_top);
}

export const cssVal = (property) => {
  return getComputedStyle(document.querySelector("html")).getPropertyValue(property);
};

export const $ = (selector, el) => {
  if (!el) el = document;
  return el.querySelector(selector);
};

export const $$ = (selector, el) => {
  if (!el) el = document;
  return el.querySelectorAll(selector);
};

export const randomId = () => {
  const LENGTH = 4;
  const SOURCE = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < LENGTH; i++) {
    result += SOURCE[Math.floor(Math.random() * SOURCE.length)];
  }

  return result;
};

export const spOnly = window.matchMedia("(max-width: 767px)").matches;

export const scaleClip = (num) => {
  // const scale = num - 1;
  // const clip = (100 * scale) / 2;

  // return `inset(${clip}%)`;

  // numの値が1の時は0%、1.1の時は4.5%、2の時は25%、3の時は33.3％、4の時は37.5になる式
  return `inset(${((num - 1) * 100) / (num * 2)}%)`;
};

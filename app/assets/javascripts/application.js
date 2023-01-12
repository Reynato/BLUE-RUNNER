import Common from "./_common.js";
import TopPage from "./pages/_index.js";

class App {
  constructor() {
    this.appArray = [];
    this.init();

    const common = new Common();
    this.appArray.push(common);

    const topPage = new TopPage();
    this.appArray.push(topPage);

    this.allInit();
  }
  allInit() {
    this.appArray.forEach((app) => {
      app.init();
    });
  }

  init() {
    // console.log("Hello World");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new App();
});

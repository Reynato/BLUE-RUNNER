(() => {
  // app/assets/javascripts/basicAuth.js
  function basicAuth() {
    const dateToYyyymmdd = (date) => {
      let n = date.getFullYear() * 1e4;
      n += date.getMonth() * 100 + 100;
      n += date.getDate();
      return ("000" + n).slice(-8);
    };
    const setPass = "reynato" + dateToYyyymmdd(new Date());
    const whiteURL = ["http://localhost:3000"];
    const htmlElStyle = document.querySelector("html").style;
    htmlElStyle.opacity = 0;
    const localPass = localStorage.getItem("fakeAuthStr");
    if (whiteURL.includes(location.host)) {
      htmlElStyle.opacity = 1;
      return;
    }
    if (localPass !== null && localPass === setPass) {
      htmlElStyle.opacity = 1;
      return;
    }
    window.setTimeout(() => {
      const password = window.prompt("\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "");
      if (password === setPass) {
        localStorage.setItem("fakeAuthStr", password);
        htmlElStyle.opacity = 1;
      } else {
        htmlElStyle.opacity = 0;
        htmlElStyle.pointerEvents = "none";
        window.alert("\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u9055\u3044\u307E\u3059");
        document.querySelector("html").remove();
      }
    }, 500);
  }
  basicAuth();
})();

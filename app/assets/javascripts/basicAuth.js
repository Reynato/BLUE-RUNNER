function basicAuth() {
  const dateToYyyymmdd = (date) => {
    let n = date.getFullYear() * 10000;
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
    const password = window.prompt("パスワードを入力してください", "");
    if (password === setPass) {
      localStorage.setItem("fakeAuthStr", password);
      htmlElStyle.opacity = 1;
    } else {
      htmlElStyle.opacity = 0;
      htmlElStyle.pointerEvents = "none";
      window.alert("パスワードが違います");
      document.querySelector("html").remove();
    }
  }, 500);
}
basicAuth();

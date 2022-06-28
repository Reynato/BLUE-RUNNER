function basicAuth() {
  const setPass = "reynato7";
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
    }
  }, 500);
}
basicAuth();

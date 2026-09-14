import { injectJavascriptToMainHtml } from "./injectJavascriptToMainHtml.js";

document.addEventListener('selectstart', (e) => {
  e.preventDefault();
});

document.addEventListener("DOMContentLoaded", ()=>{
  injectJavascriptToMainHtml()
})


// const notificationBtn = document.querySelector(".notifications-permission-btn")

// notificationBtn.addEventListener(
//   "click",
//   requestAndShowTestNotification
// );


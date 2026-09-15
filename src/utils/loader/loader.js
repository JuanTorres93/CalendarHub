import createElement from "../helpers/createElement.js";
import { loader } from "../helpers/dom/mainCalendarDom.js";

export function appready() {
  loader.classList.add("loader-hide");

  loader.addEventListener(
    "animationend",
    () => {
      loader.remove();
    },
    { once: true },
  );
}

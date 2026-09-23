export function appready(loaderElement) {
  loaderElement.classList.add("loader-hide");

  loaderElement.addEventListener(
    "animationend",
    () => {
      loaderElement.remove();
    },
    { once: true },
  );
}
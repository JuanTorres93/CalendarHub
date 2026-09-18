export function createViewSwitcher() {
  let currentState = 0;
  let deps = null;

  function init(newDeps) {
    deps = newDeps;
  }

  function switchView(index) {
    const { monthView, weekView, dayView, displayOverlays } = deps;
    const gridView = [monthView, weekView, dayView];
    const overlays = [...displayOverlays];

    if (currentState !== index) {
      gridView.forEach((view, i) =>
        view.classList.toggle('show-section', i === index),
      );
      overlays.forEach((ov, i) =>
        ov.classList.toggle('show-display', i === index),
      );
      currentState = index;
    }
  }

  function initDefaultView() {
    const { monthView, displayOverlayMonth } = deps;

    currentState = 0;

    monthView.classList.add('show-section');
    displayOverlayMonth.classList.add('show-display');
  }

  return { init, switchView, initDefaultView };
}

export const viewSwitcher = createViewSwitcher();

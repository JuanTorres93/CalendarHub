export default function getFloatingPosition(floatingElement, target, option) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let top, left;
  const margin = 16;

  const floatingRect = floatingElement.getBoundingClientRect();

  const floatingWidth = floatingRect.width;
  const floatingHeight = floatingRect.height;
  const hasSpaceBelow =
    target.bottom + floatingElement.clientHeight <= viewportHeight;
  const hasSpaceAbove = target.top - floatingElement.clientHeight >= 0;
  const hasSpaceRight =
    target.right + floatingElement.clientWidth <= viewportWidth;
  const hasSpaceLeft = target.left - floatingElement.clientWidth >= 0;

  if (viewportWidth <= 992) {
    top = viewportHeight / 2 - floatingElement.clientHeight / 2;
    left = viewportWidth / 2 - floatingElement.clientWidth / 2;
  } else {
    if (!option) {
      if (hasSpaceBelow || !hasSpaceAbove) {
        top = target.top;
      } else {
        top = target.bottom - floatingElement.clientHeight - 30;
      }

      if (hasSpaceRight || !hasSpaceLeft) {
        left = target.right;
      } else {
        left = target.left - floatingElement.clientWidth;
      }
    }
    if (option) {
      if (hasSpaceBelow || !hasSpaceAbove) {
        top = target.top;
      } else {
        top = target.bottom - floatingElement.clientHeight;
      }
      left = viewportWidth / 2 - floatingElement.clientWidth / 2;
    }
  }

  top = Math.max(
    margin,
    Math.min(top, viewportHeight - floatingHeight - margin),
  );

  floatingElement.style.top = `${top}px`;
  floatingElement.style.left = `${left}px`;
}

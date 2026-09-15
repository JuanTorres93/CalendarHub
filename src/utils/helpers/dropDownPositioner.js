function getDropDownPosition(conatinerElement, fatherContainer) {
  let left;

  const viewportWidth = window.innerWidth;

  const containerRect = conatinerElement.getBoundingClientRect();
  const fatherRect = fatherContainer.getBoundingClientRect();

  const containerWidth = containerRect.width;
  const fatherWidth = fatherRect.width;

  const hasSpaceRight = fatherRect.right + containerWidth <= viewportWidth;

  if (hasSpaceRight) {
    left = fatherWidth + 2;
  } else {
    left = -containerWidth;
  }

  conatinerElement.style.left = `${left}px`;
}

export default getDropDownPosition;

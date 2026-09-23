export function bindEventInfoClick(eventElement) {
  eventElement.addEventListener('click', async (e) => {
    e.stopPropagation();

    const { renderExtraInfo } = await import(
      '../../../eventCreation/infoBanner.js'
    );

    renderExtraInfo(eventElement, e);
  });
}
export function createTimedEvent({ event, eventClass, layout }) {
  const eventElement = document.createElement('div');
  eventElement.className = eventClass;
  eventElement.dataset.id = event.id;
  eventElement.classList.add(`event-${event.color}`);

  if (event.isOccurrence) {
    const icon = document.createElement('span');
    icon.textContent = event.icon;

    const title = document.createElement('span');
    title.textContent = event.title;

    const repeatIcon = document.createElement('small');
    repeatIcon.className = 'repeat-icon-alt';
    repeatIcon.textContent = '🔗';

    eventElement.appendChild(icon);
    eventElement.appendChild(title);
    eventElement.appendChild(repeatIcon);
  } else {
    const renderTime = document.createElement('span');
    renderTime.className = 'render-time';
    renderTime.textContent = event.from;

    const titleContainer = document.createElement('p');
    titleContainer.className = 'render-title';

    const titleIcon = document.createElement('span');
    titleIcon.textContent = event.icon;

    titleContainer.appendChild(titleIcon);
    titleContainer.appendChild(document.createTextNode(` ${event.title}`));

    eventElement.appendChild(renderTime);
    eventElement.appendChild(titleContainer);
  }

  if (event.urgent) {
    eventElement.classList.add('event-urgent');
  }

  eventElement.style.top = `${layout.top}px`;
  eventElement.style.height = `${layout.height}px`;
  eventElement.style.width = `${layout.width}%`;
  eventElement.style.left = `${layout.left}%`;

  return eventElement;
}
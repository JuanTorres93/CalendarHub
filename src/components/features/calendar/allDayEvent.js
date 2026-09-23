export function createAllDayEvent({ event, allDayClass }) {
  const eventElement = document.createElement('div');
  eventElement.className = allDayClass;
  eventElement.dataset.id = event.id;
  eventElement.classList.add(`event-${event.color}`);

  if (event.urgent) {
    eventElement.classList.add('event-urgent');
  }

  const startText = document.createElement('span');
  startText.className = 'all-event-start-text';
  startText.textContent = 'Oggi:';

  const titleContainer = document.createElement('p');
  const titleIcon = document.createElement('span');
  titleIcon.textContent = event.icon;

  titleContainer.appendChild(titleIcon);
  titleContainer.appendChild(document.createTextNode(event.title));

  eventElement.appendChild(startText);
  eventElement.appendChild(titleContainer);

  return eventElement;
}
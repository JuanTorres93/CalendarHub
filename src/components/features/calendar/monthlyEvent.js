export function createMonthlyEvent({ event }) {
  const eventElement = document.createElement('div');
  eventElement.className = 'monthly-event';
  eventElement.dataset.id = event.id;
  eventElement.setAttribute('data-testid', `monthly-event-${event.id}`);
  eventElement.classList.add(`event-${event.color}`);

  if (event.urgent) {
    eventElement.classList.add('event-urgent');
  }

  if (event.allDay) {
    eventElement.classList.add('render-allDay');

    const todayLabel = document.createElement('span');
    todayLabel.textContent = 'Oggi:';

    const title = document.createElement('p');
    title.textContent = event.title;

    eventElement.appendChild(todayLabel);
    eventElement.appendChild(title);
  } else {
    const icon = document.createElement('span');
    icon.className = 'icon-month';
    icon.textContent = event.icon;

    const title = document.createElement('span');
    title.className = 'title-month';
    title.textContent = event.title;

    eventElement.appendChild(icon);
    eventElement.appendChild(title);

    if (event.isOccurrence) {
      const repeatIcon = document.createElement('small');
      repeatIcon.className = 'repeat-icon';
      repeatIcon.textContent = '🔗';

      eventElement.appendChild(repeatIcon);
    }
  }

  return eventElement;
}
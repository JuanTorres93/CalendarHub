export function createCurrentEventMode() {
  const currentEventMode = document.createElement('header');
  currentEventMode.className = 'current-event-mode';

  const title = document.createElement('h3');
  title.id = 'event-modal-title';
  title.className = 'modal-info-mode';

  const description = document.createElement('p');
  description.id = 'event-modal-description';
  description.className = 'current-mode-secondary-message';

  currentEventMode.appendChild(title);
  currentEventMode.appendChild(description);

  return currentEventMode;
}

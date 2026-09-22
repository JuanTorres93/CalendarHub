export function createShowDate() {
  const showDate = document.createElement('div');
  showDate.className = 'show-date';
  showDate.setAttribute('data-testid', 'event-date-display');

  const date = document.createElement('span');
  date.setAttribute('data-day', '');
  date.classList.add('first-row-date');

  const separator = document.createElement('span');

  showDate.appendChild(date);
  showDate.appendChild(separator);

  return {
    mainComponent: showDate,
    internalDomElements: { header: showDate },
  };
}
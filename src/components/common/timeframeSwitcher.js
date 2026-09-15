export default function createTimeframeSwitcher() {
  const container = document.createElement('div');

  container.className = 'mode-btns';
  container.setAttribute('aria-label', 'Selezione vista calendario');

  timeframes.forEach(({ id, testid, label }) => {
    const button = document.createElement('button');

    button.id = id;
    button.className = 'btns-nav';
    button.type = 'button';
    button.setAttribute('data-testid', testid);
    button.textContent = label;

    container.appendChild(button);
  });

  return container;
}

const timeframes = [
  { id: 'day-btn', testid: 'day-button', label: 'Giorno' },
  { id: 'week-btn', testid: 'week-button', label: 'Settimana' },
  { id: 'month-btn', testid: 'month-button', label: 'Mese' },
];

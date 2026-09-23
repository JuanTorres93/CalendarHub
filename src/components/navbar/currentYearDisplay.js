export default function createCurrentYearDisplay() {
  const container = document.createElement('div');

  container.id = 'show-year';

  const button = document.createElement('button');

  button.className = 'big-numbers year';
  button.type = 'button';
  button.setAttribute('aria-label', 'Apri mini calendario');
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('data-testid', 'show-year-mini-calendar-button');

  button.addEventListener('click', async (e) => {
    const anchorElement = e.currentTarget;

    const { openMiniCalendar } = await import(
      '../../miniCalendar/miniCalendarLogic.js'
    );

    openMiniCalendar('normal', null, 'normal', anchorElement);
  });

  container.appendChild(button);

  return {
    node: container,
    render: (date) => {
      button.textContent = date.year();
    },
  };
}
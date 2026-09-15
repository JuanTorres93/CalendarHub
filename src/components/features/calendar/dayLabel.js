export function createDayLabel({ type, date, className }) {
  const dayName = date.format('dddd');

  if (type === 'month') {
    const label = document.createElement('div');
    label.className = className;
    label.textContent = dayName;

    return label;
  }

  if (type === 'day') {
    const label = document.createElement('div');
    label.className = 'daily-current-header';

    const heading = document.createElement('h2');
    heading.textContent = date.format('dddd, DD');

    label.appendChild(heading);

    return label;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'header-btn';
  button.setAttribute(
    'aria-label',
    `Seleziona ${date.format('dddd D MMMM YYYY')}`,
  );

  const dayLabel = document.createElement('span');
  dayLabel.className = 'day-label';
  dayLabel.textContent = date.format('DD');

  const dayLabelText = document.createElement('span');
  dayLabelText.className = 'day-label-text';
  dayLabelText.setAttribute('data-shrinkDays', dayName.slice(0, 3));
  dayLabelText.textContent = dayName;

  button.appendChild(dayLabel);
  button.appendChild(document.createElement('br'));
  button.appendChild(document.createElement('br'));
  button.appendChild(dayLabelText);

  return button;
}
import { createTimeInput } from './timeInput';

export function createToTime() {
  const toContainer = document.createElement('div');
  toContainer.id = 'a-time';

  const toBtn = document.createElement('button');
  toBtn.type = 'button';
  toBtn.className = 'listed-time to';
  toBtn.setAttribute('aria-label', 'Seleziona ora di fine');
  toBtn.setAttribute('data-testid', 'event-to-time-button');
  toBtn.textContent = '⏳';

  const toInputGroup = document.createElement('div');
  toInputGroup.className = 'time-input-group to';

  const toHourInput = createTimeInput({
    className: 'input-hour to',
    placeholder: '14',
    ariaLabel: 'Ora di fine',
    testId: 'event-to-hour-input',
    name: 'event-to-hour',
  });

  const separator = document.createElement('span');
  separator.className = 'time-separator';
  separator.setAttribute('aria-hidden', 'true');
  separator.textContent = ':';

  const toMinuteInput = createTimeInput({
    className: 'input-minute to',
    placeholder: '30',
    ariaLabel: 'Minuti di fine',
    testId: 'event-to-minute-input',
    name: 'event-to-minute',
  });

  toInputGroup.appendChild(toHourInput);
  toInputGroup.appendChild(separator);
  toInputGroup.appendChild(toMinuteInput);

  const toList = document.createElement('ul');
  toList.className = 'interactive-time-list to';
  toList.setAttribute('data-testid', 'event-to-time-list');

  toContainer.appendChild(toBtn);
  toContainer.appendChild(toInputGroup);
  toContainer.appendChild(toList);

  return toContainer;
}

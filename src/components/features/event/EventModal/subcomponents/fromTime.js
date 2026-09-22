import { createTimeInput } from './timeInput';

export function createFromTime() {
  const fromContainer = document.createElement('div');
  fromContainer.id = 'da-time';

  const fromBtn = document.createElement('button');
  fromBtn.type = 'button';
  fromBtn.className = 'listed-time from';
  fromBtn.setAttribute('aria-label', 'Seleziona ora di inizio');
  fromBtn.setAttribute('data-testid', 'event-from-time-button');
  fromBtn.textContent = '⌛';

  const fromInputGroup = document.createElement('div');
  fromInputGroup.className = 'time-input-group from';

  const fromHourInput = createTimeInput({
    className: 'input-hour from',
    placeholder: '13',
    ariaLabel: 'Ora di inizio',
    testId: 'event-from-hour-input',
    name: 'event-from-hour',
  });

  const separator = document.createElement('span');
  separator.className = 'time-separator';
  separator.setAttribute('aria-hidden', 'true');
  separator.textContent = ':';

  const fromMinuteInput = createTimeInput({
    className: 'input-minute from',
    placeholder: '00',
    ariaLabel: 'Minuti di inizio',
    testId: 'event-from-minute-input',
    name: 'event-from-minute',
  });

  fromInputGroup.appendChild(fromHourInput);
  fromInputGroup.appendChild(separator);
  fromInputGroup.appendChild(fromMinuteInput);

  const fromList = document.createElement('ul');
  fromList.className = 'interactive-time-list from';
  fromList.setAttribute('data-testid', 'event-from-time-list');

  fromContainer.appendChild(fromBtn);
  fromContainer.appendChild(fromInputGroup);
  fromContainer.appendChild(fromList);

  return fromContainer;
}

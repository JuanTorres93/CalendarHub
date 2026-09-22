import { createFromTime } from './fromTime';
import { createToTime } from './toTime';

export function createTimeRow() {
  const timeRow = document.createElement('div');
  timeRow.id = 'row-time';

  const timeSelection = document.createElement('div');
  timeSelection.className = 'time-selection';

  timeSelection.appendChild(createFromTime());
  timeSelection.appendChild(createToTime());

  const eventRepeat = document.createElement('div');
  eventRepeat.id = 'event-repeat';

  const repeatText = document.createElement('p');
  repeatText.className = 'desc-text';
  repeatText.textContent = 'Ripeti :';

  const repeatBtn = document.createElement('button');
  repeatBtn.type = 'button';
  repeatBtn.className = 'event-repeat-btn';
  repeatBtn.setAttribute('aria-label', 'Configura ripetizione evento');
  repeatBtn.setAttribute('aria-haspopup', 'dialog');
  repeatBtn.setAttribute('data-testid', 'event-repeat-button');
  repeatBtn.textContent = '\u27F3';

  eventRepeat.appendChild(repeatText);
  eventRepeat.appendChild(repeatBtn);

  timeRow.appendChild(timeSelection);
  timeRow.appendChild(eventRepeat);

  return timeRow;
}

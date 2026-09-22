import { createFromTime } from './fromTime';
import { createToTime } from './toTime';

export function createTimeRow() {
  const timeRow = document.createElement('div');
  timeRow.id = 'row-time';

  const timeSelection = document.createElement('div');
  timeSelection.className = 'time-selection';

  const fromTime = createFromTime();
  const toTime = createToTime();

  timeSelection.appendChild(fromTime.mainComponent);
  timeSelection.appendChild(toTime.mainComponent);

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

  return {
    mainComponent: timeRow,
    internalDomElements: {
      timeRow,
      timeSelectionContainer: timeSelection,
      repeatBtn,
      ulContainer: [fromTime.internalDomElements.listedTimeFrom, toTime.internalDomElements.listedTimeTo],
      ...fromTime.internalDomElements,
      ...toTime.internalDomElements,
    },
  };
}
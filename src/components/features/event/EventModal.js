import { createEventRepeatModal } from './eventRepeatModal.js';

export function createEventModal() {
  const fragment = document.createDocumentFragment();

  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  overlay.setAttribute('aria-hidden', 'true');

  const eventContainer = document.createElement('section');
  eventContainer.className = 'event-container';
  eventContainer.setAttribute('role', 'dialog');
  eventContainer.setAttribute('aria-modal', 'true');
  eventContainer.setAttribute('aria-labelledby', 'event-modal-title');
  eventContainer.setAttribute(
    'aria-describedby',
    'event-modal-description',
  );
  eventContainer.setAttribute('data-testid', 'event-popup-container');

  eventContainer.appendChild(createCurrentEventMode());

  const eventForm = document.createElement('form');
  eventForm.className = 'event-form';
  eventForm.setAttribute('data-testid', 'event-form');

  eventForm.appendChild(createShowDate());
  eventForm.appendChild(createEventDescription());
  eventForm.appendChild(createCategorySelector());
  eventForm.appendChild(createDateRow());
  eventForm.appendChild(createTimeRow());
  eventForm.appendChild(createNotificationRow());
  eventForm.appendChild(createEventRepeatModal());

  const repeatOverlay = document.createElement('div');
  repeatOverlay.className = 'repeat-overlay';
  repeatOverlay.setAttribute('aria-hidden', 'true');

  eventForm.appendChild(repeatOverlay);
  eventContainer.appendChild(eventForm);

  fragment.appendChild(overlay);
  fragment.appendChild(eventContainer);

  return fragment;
}

function createCurrentEventMode() {
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

function createShowDate() {
  const showDate = document.createElement('div');
  showDate.className = 'show-date';
  showDate.setAttribute('data-testid', 'event-date-display');

  const date = document.createElement('span');
  date.setAttribute('data-day', '');
  date.classList.add('first-row-date');

  const separator = document.createElement('span');

  showDate.appendChild(date);
  showDate.appendChild(separator);

  return showDate;
}

function createEventDescription() {
  const descriptionRow = document.createElement('div');
  descriptionRow.className = 'event-description';

  const iconsContainer = document.createElement('div');
  iconsContainer.id = 'icons';

  const iconBtn = document.createElement('button');
  iconBtn.id = 'icons-btn';
  iconBtn.type = 'button';
  iconBtn.setAttribute('aria-label', 'Scegli icona evento');
  iconBtn.setAttribute('data-testid', 'event-icon-button');
  iconBtn.textContent = '✏️';

  const iconsList = document.createElement('ul');
  iconsList.className = 'icons-list';
  iconsList.setAttribute('data-testid', 'event-icon-list');

  iconsContainer.appendChild(iconBtn);
  iconsContainer.appendChild(iconsList);

  const titleContainer = document.createElement('div');
  titleContainer.id = 'title-container';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'input-name';
  titleInput.setAttribute('placeholder', 'Titolo');
  titleInput.setAttribute('aria-label', 'Titolo evento');
  titleInput.setAttribute('data-testid', 'event-title-input');
  titleInput.name = 'event-title';

  titleContainer.appendChild(titleInput);

  const descriptionContainer = document.createElement('div');
  descriptionContainer.id = 'description-container';

  const descriptionText = document.createElement('p');
  descriptionText.className = 'desc-text';
  descriptionText.textContent = 'Descrivi :';

  const descriptionBtn = document.createElement('button');
  descriptionBtn.type = 'button';
  descriptionBtn.className = 'btn-description';
  descriptionBtn.setAttribute('aria-label', 'Mostra o nascondi descrizione');
  descriptionBtn.setAttribute('data-testid', 'event-description-toggle');
  descriptionBtn.textContent = '📃';

  const descriptionArea = document.createElement('section');
  descriptionArea.className = 'description-area';
  descriptionArea.setAttribute('data-testid', 'event-description-area');

  const descriptionInput = document.createElement('textarea');
  descriptionInput.className = 'description-area-text';
  descriptionInput.maxLength = '200';
  descriptionInput.setAttribute('placeholder', 'Max 200 caratteri');
  descriptionInput.setAttribute('aria-label', 'Descrizione evento');
  descriptionInput.setAttribute('data-testid', 'event-description-input');
  descriptionInput.name = 'event-description';

  descriptionArea.appendChild(descriptionInput);
  descriptionContainer.appendChild(descriptionText);
  descriptionContainer.appendChild(descriptionBtn);
  descriptionContainer.appendChild(descriptionArea);

  descriptionRow.appendChild(iconsContainer);
  descriptionRow.appendChild(titleContainer);
  descriptionRow.appendChild(descriptionContainer);

  return descriptionRow;
}

function createCategorySelector() {
  const categoryRow = document.createElement('div');
  categoryRow.className = 'category-selector';

  const categoryContainer = document.createElement('div');
  categoryContainer.className = 'category-container';

  const categoryText = document.createElement('p');
  categoryText.className = 'desc-text';
  categoryText.textContent = 'Categoria :';

  const colorPreview = document.createElement('div');
  colorPreview.className = 'color-preview';
  colorPreview.setAttribute('data-testid', 'event-color-preview');

  const colorBtn = document.createElement('button');
  colorBtn.id = 'color-btn';
  colorBtn.type = 'button';
  colorBtn.setAttribute('aria-label', 'Scegli colore categoria');
  colorBtn.setAttribute('data-testid', 'event-color-button');
  colorBtn.textContent = '🎨';

  categoryContainer.appendChild(categoryText);
  categoryContainer.appendChild(colorPreview);
  categoryContainer.appendChild(colorBtn);

  const colorList = document.createElement('ul');
  colorList.className = 'color-list';
  colorList.setAttribute('data-testid', 'event-color-list');

  const urgentContainer = document.createElement('div');
  urgentContainer.id = 'urgent-container';

  const urgentText = document.createElement('p');
  urgentText.className = 'desc-text';
  urgentText.textContent = 'Urgente :';

  const urgentBtn = document.createElement('button');
  urgentBtn.id = 'urgent-btn';
  urgentBtn.type = 'button';
  urgentBtn.setAttribute('aria-label', 'Contrassegna come urgente');
  urgentBtn.setAttribute('aria-pressed', 'false');
  urgentBtn.setAttribute('data-testid', 'event-urgent-button');
  urgentBtn.appendChild(createCheckboxIcon());

  urgentContainer.appendChild(urgentText);
  urgentContainer.appendChild(urgentBtn);

  categoryRow.appendChild(categoryContainer);
  categoryRow.appendChild(colorList);
  categoryRow.appendChild(urgentContainer);

  return categoryRow;
}

function createDateRow() {
  const dateRow = document.createElement('div');
  dateRow.id = 'row-date';

  const eventDate = document.createElement('div');
  eventDate.className = 'event-date';

  const dateText = document.createElement('p');
  dateText.className = 'desc-text';
  dateText.textContent = 'Data :';

  const dateIcon = document.createElement('div');
  dateIcon.className = 'date-icon';

  const miniCalendarBtn = document.createElement('button');
  miniCalendarBtn.type = 'button';
  miniCalendarBtn.className = 'mini-calendar-btn';
  miniCalendarBtn.setAttribute('aria-label', 'Scegli data');
  miniCalendarBtn.setAttribute('aria-haspopup', 'dialog');
  miniCalendarBtn.setAttribute('data-testid', 'event-date-button');
  miniCalendarBtn.textContent = '📆';

  dateIcon.appendChild(miniCalendarBtn);
  eventDate.appendChild(dateText);
  eventDate.appendChild(dateIcon);

  const allDay = document.createElement('div');
  allDay.id = 'all-day';

  const allDayText = document.createElement('p');
  allDayText.className = 'desc-text';
  allDayText.textContent = 'Giornata Intera :';

  const allDayBtn = document.createElement('button');
  allDayBtn.id = 'all-day-btn';
  allDayBtn.type = 'button';
  allDayBtn.setAttribute('aria-label', "Evento per l'intera giornata");
  allDayBtn.setAttribute('aria-pressed', 'false');
  allDayBtn.setAttribute('data-testid', 'event-all-day-button');
  allDayBtn.appendChild(createCheckboxIcon());

  allDay.appendChild(allDayText);
  allDay.appendChild(allDayBtn);

  dateRow.appendChild(eventDate);
  dateRow.appendChild(allDay);

  return dateRow;
}

function createTimeRow() {
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

function createFromTime() {
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

function createToTime() {
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

function createTimeInput({ className, placeholder, ariaLabel, testId, name }) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = className;
  input.setAttribute('placeholder', placeholder);
  input.maxLength = '2';
  input.setAttribute('inputmode', 'numeric');
  input.setAttribute('aria-label', ariaLabel);
  input.setAttribute('data-testid', testId);
  input.name = name;

  return input;
}

function createNotificationRow() {
  const notificationRow = document.createElement('div');
  notificationRow.id = 'notification-row';

  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'notification-container';

  const notificationIcon = document.createElement('div');
  notificationIcon.className = 'notification-icon';
  notificationIcon.textContent = '⏰';

  const notificationBtn = document.createElement('button');
  notificationBtn.type = 'button';
  notificationBtn.className = 'notification-button';
  notificationBtn.setAttribute('aria-label', 'Scegli quando ricevere la notifica');
  notificationBtn.setAttribute('data-testid', 'event-notification-button');
  notificationBtn.textContent = '5 minuti prima';

  const notificationList = document.createElement('ul');
  notificationList.className = 'notification-list';
  notificationList.setAttribute('data-testid', 'event-notification-list');

  notificationContainer.appendChild(notificationIcon);
  notificationContainer.appendChild(notificationBtn);
  notificationContainer.appendChild(notificationList);

  const saveContainer = document.createElement('div');
  saveContainer.id = 'save-event';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn save-btn';
  saveBtn.setAttribute('aria-label', 'Salva evento');
  saveBtn.setAttribute('data-testid', 'event-save-button');
  saveBtn.textContent = 'save';

  saveContainer.appendChild(saveBtn);

  const closeContainer = document.createElement('div');
  closeContainer.id = 'close-event';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn close-btn';
  closeBtn.setAttribute('aria-label', 'Chiudi finestra evento');
  closeBtn.setAttribute('data-testid', 'event-close-button');
  closeBtn.textContent = 'chiudi';

  closeContainer.appendChild(closeBtn);

  notificationRow.appendChild(notificationContainer);
  notificationRow.appendChild(saveContainer);
  notificationRow.appendChild(closeContainer);

  return notificationRow;
}

function createCheckboxIcon() {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  icon.setAttribute('width', '32');
  icon.setAttribute('height', '32');
  icon.setAttribute('viewBox', '0 0 512 512');

  const checkPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  checkPath.classList.add('checkBox');
  checkPath.setAttribute('fill', 'none');
  checkPath.setAttribute('stroke', 'currentColor');
  checkPath.setAttribute('stroke-linecap', 'round');
  checkPath.setAttribute('stroke-linejoin', 'round');
  checkPath.setAttribute('stroke-width', '32');
  checkPath.setAttribute('d', 'M352 176L217.6 336L160 272');

  const checkboxRect = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect',
  );
  checkboxRect.classList.add('square-checkbox');
  checkboxRect.setAttribute('width', '384');
  checkboxRect.setAttribute('height', '384');
  checkboxRect.setAttribute('x', '64');
  checkboxRect.setAttribute('y', '64');
  checkboxRect.setAttribute('fill', 'none');
  checkboxRect.setAttribute('stroke', 'currentColor');
  checkboxRect.setAttribute('stroke-linejoin', 'round');
  checkboxRect.setAttribute('stroke-width', '32');
  checkboxRect.setAttribute('rx', '48');
  checkboxRect.setAttribute('ry', '48');

  icon.appendChild(checkPath);
  icon.appendChild(checkboxRect);

  return icon;
}

export default createEventModal;
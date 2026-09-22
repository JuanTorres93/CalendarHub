export function createEventRepeatModal() {
  const repeatContainer = document.createElement('section');
  repeatContainer.className = 'modal-repeat';
  repeatContainer.setAttribute('role', 'dialog');
  repeatContainer.setAttribute('aria-labelledby', 'repeat-modal-title');
  repeatContainer.setAttribute('data-testid', 'event-repeat-modal');

  const repeatTitle = createRepeatTitle();
  const mode = createRepeatModeContainer();
  const interval = createRepeatIntervalContainer();
  const weekly = createWeeklyRepetitionContainer();
  const until = createEndRepeatEventContainer();
  const custom = createCustomDatesContainer();
  const close = createCloseRepeatContainer();

  repeatContainer.appendChild(repeatTitle.mainComponent);
  repeatContainer.appendChild(mode.mainComponent);
  repeatContainer.appendChild(interval.mainComponent);
  repeatContainer.appendChild(weekly.mainComponent);
  repeatContainer.appendChild(until.mainComponent);
  repeatContainer.appendChild(custom.mainComponent);
  repeatContainer.appendChild(close.mainComponent);

  return {
    mainComponent: repeatContainer,
    internalDomElements: {
      repeatContainer,
      ...mode.internalDomElements,
      ...interval.internalDomElements,
      ...weekly.internalDomElements,
      ...until.internalDomElements,
      ...custom.internalDomElements,
      ...close.internalDomElements,
    },
  };
}

function createRepeatTitle() {
  const title = document.createElement('h2');
  title.id = 'repeat-modal-title';
  title.className = 'visually-hidden';
  title.textContent = 'Configura ripetizione evento';

  return { mainComponent: title };
}

function createRepeatModeContainer() {
  const modeContainer = document.createElement('div');
  modeContainer.className = 'repeat-mode-container';

  const text = document.createElement('p');
  text.textContent = 'Scegli tipo di ripetizione :';

  const modeBtn = document.createElement('button');
  modeBtn.type = 'button';
  modeBtn.className = 'repeat-mode-btn';
  modeBtn.setAttribute('aria-label', 'Scegli tipo di ripetizione');
  modeBtn.setAttribute('data-testid', 'event-repeat-mode-button');

  const modeList = document.createElement('ul');
  modeList.id = 'repeat-mode-options';
  modeList.className = 'repeat-mode-list';
  modeList.setAttribute('data-testid', 'event-repeat-mode-list');

  const modes = [
    { type: 'daily', label: 'Quotidiano', testId: 'repeat-mode-option-daily' },
    { type: 'weekly', label: 'Settimanale', testId: 'repeat-mode-option-weekly' },
    { type: 'monthly', label: 'Mensile', testId: 'repeat-mode-option-monthly' },
    { type: 'custom', label: 'Personalizzata', testId: 'repeat-mode-option-custom' },
  ];

  modes.forEach((mode) => {
    const modeItem = document.createElement('li');
    modeItem.className = 'repeat-mode-list-item';
    modeItem.setAttribute('data-repeat-type', mode.type);
    modeItem.setAttribute('data-testid', mode.testId);
    modeItem.textContent = mode.label;

    modeList.appendChild(modeItem);
  });

  modeContainer.appendChild(text);
  modeContainer.appendChild(modeBtn);
  modeContainer.appendChild(modeList);

  return {
    mainComponent: modeContainer,
    internalDomElements: { modeContainer, modeBtn, modeList },
  };
}

function createRepeatIntervalContainer() {
  const intervalContainer = document.createElement('div');
  intervalContainer.className = 'repeat-intervall-container';

  const intervalTextContainer = document.createElement('div');
  intervalTextContainer.className = 'intervall-text-container';

  const staticText = document.createElement('p');
  staticText.className = 'static-intervall-text';
  staticText.textContent = 'Intervallo :';

  const intervalInput = document.createElement('input');
  intervalInput.type = 'text';
  intervalInput.setAttribute('placeholder', '1');
  intervalInput.className = 'intervall-input';
  intervalInput.setAttribute('inputmode', 'numeric');
  intervalInput.setAttribute('aria-label', 'Intervallo di ripetizione');
  intervalInput.setAttribute(
    'aria-describedby',
    'dynamic-interval-description',
  );
  intervalInput.setAttribute('data-testid', 'event-repeat-interval-input');
  intervalInput.name = 'event-repeat-interval';

  intervalTextContainer.appendChild(staticText);
  intervalTextContainer.appendChild(intervalInput);

  const dynamicText = document.createElement('p');
  dynamicText.id = 'dynamic-interval-description';
  dynamicText.className = 'dinamic-interval-text';
  dynamicText.setAttribute('aria-live', 'polite');
  dynamicText.textContent = 'ogni 2 giorni';

  intervalContainer.appendChild(intervalTextContainer);
  intervalContainer.appendChild(dynamicText);

  return {
    mainComponent: intervalContainer,
    internalDomElements: { intervalContainer, intervalInput, intervalText: dynamicText },
  };
}

function createWeeklyRepetitionContainer() {
  const weeklyContainer = document.createElement('div');
  weeklyContainer.className = 'weekly-repetion-container';

  const text = document.createElement('p');
  text.textContent = 'Ripeti il:';

  const weeklyList = document.createElement('ul');
  weeklyList.className = 'weekly-repetion-list';
  weeklyList.setAttribute('aria-label', 'Giorni della settimana');
  weeklyList.setAttribute('data-testid', 'event-repeat-weekdays-list');

  weeklyContainer.appendChild(text);
  weeklyContainer.appendChild(weeklyList);

  return {
    mainComponent: weeklyContainer,
    internalDomElements: { weeklyContainer, dayOfWeekList: weeklyList },
  };
}

function createEndRepeatEventContainer() {
  const untilContainer = document.createElement('div');
  untilContainer.className = 'end-repeat-event-container';

  const openUntilContainer = document.createElement('div');
  openUntilContainer.className = 'open-miniCalendar-repeation-container';

  const text = document.createElement('p');
  text.textContent = 'Fino al:';

  const untilBtn = document.createElement('button');
  untilBtn.className = 'open-miniCalendar-repeation';
  untilBtn.type = 'button';
  untilBtn.setAttribute('aria-label', 'Seleziona data di fine ripetizione');
  untilBtn.setAttribute('aria-haspopup', 'dialog');
  untilBtn.setAttribute('data-testid', 'event-repeat-until-button');
  untilBtn.textContent = '📆';

  openUntilContainer.appendChild(text);
  openUntilContainer.appendChild(untilBtn);

  const untilText = document.createElement('p');
  untilText.className = 'end-repeation-event-date';
  untilText.setAttribute('aria-live', 'polite');
  untilText.setAttribute('data-testid', 'event-repeat-until-display');
  untilText.textContent = '5 Marzo 2026';

  untilContainer.appendChild(openUntilContainer);
  untilContainer.appendChild(untilText);

  return {
    mainComponent: untilContainer,
    internalDomElements: { untilContainer, untilMiniCalendarBtn: untilBtn, untilText },
  };
}

function createCustomDatesContainer() {
  const customContainer = document.createElement('div');
  customContainer.className = 'custom-dates-container';

  const openCustomContainer = document.createElement('div');
  openCustomContainer.className = 'open-custom-date-container';

  const text = document.createElement('p');
  text.textContent = 'Date personalizzate:';

  const customBtn = document.createElement('button');
  customBtn.className = 'open-miniCalendar-custom-date';
  customBtn.type = 'button';
  customBtn.setAttribute('aria-label', 'Aggiungi data personalizzata');
  customBtn.setAttribute('aria-haspopup', 'dialog');
  customBtn.setAttribute('data-testid', 'event-repeat-custom-date-button');
  customBtn.textContent = '📆';

  openCustomContainer.appendChild(text);
  openCustomContainer.appendChild(customBtn);

  const customList = document.createElement('ul');
  customList.className = 'custom-dates-list';
  customList.setAttribute('aria-label', 'Date personalizzate selezionate');
  customList.setAttribute('data-testid', 'event-repeat-custom-dates-list');

  customContainer.appendChild(openCustomContainer);
  customContainer.appendChild(customList);

  return {
    mainComponent: customContainer,
    internalDomElements: {
      customContainer,
      customMiniCalendarBtn: customBtn,
      customList,
    },
  };
}

function createCloseRepeatContainer() {
  const closeContainer = document.createElement('div');
  closeContainer.className = 'close-repeat';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn save-repeat';
  saveBtn.type = 'button';
  saveBtn.setAttribute('aria-label', 'Salva impostazioni di ripetizione');
  saveBtn.setAttribute('data-testid', 'event-repeat-save-button');
  saveBtn.textContent = 'salva';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn cls-repeat';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Chiudi impostazioni di ripetizione');
  closeBtn.setAttribute('data-testid', 'event-repeat-close-button');
  closeBtn.textContent = 'chiudi';

  closeContainer.appendChild(saveBtn);
  closeContainer.appendChild(closeBtn);

  return {
    mainComponent: closeContainer,
    internalDomElements: { closeRepeatContainer: closeContainer, closeBtn, saveBtn },
  };
}
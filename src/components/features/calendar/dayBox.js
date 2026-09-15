export function createDayBox({ dataDayID, extraClasses = [], isMini = false }) {
  const dayBox = document.createElement('div');
  const dayContainer = document.createElement('div');
  const insideBoxGrid = document.createElement('div');
  const dayNumberButton = document.createElement('button');
  const todoContainer = document.createElement('div');
  const eventsContainer = document.createElement('div');

  const dayNumber = dataDayID.split('-')[dataDayID.split('-').length - 1];

  extraClasses.forEach((extraClass) => dayBox.classList.add(extraClass));
  dayBox.setAttribute('data-action', 'create-event');
  dayBox.setAttribute('data-day', dataDayID);
  dayBox.setAttribute('data-testid', `day-box-${dataDayID}`);

  dayBox.appendChild(dayContainer);
  dayContainer.classList.add(`${isMini ? 'mini' : ''}fist-row-month`);

  dayContainer.appendChild(insideBoxGrid);
  insideBoxGrid.classList.add(`${isMini ? 'mini' : ''}box-grid`);

  insideBoxGrid.appendChild(dayNumberButton);
  dayContainer.appendChild(todoContainer);
  dayContainer.appendChild(eventsContainer);

  dayNumberButton.classList.add(`${isMini ? 'mini' : ''}number-box`);
  dayNumberButton.setAttribute('type', 'button');
  dayNumberButton.setAttribute('data-day', dataDayID);
  dayNumberButton.setAttribute('data-action', 'select-date');
  dayNumberButton.setAttribute('aria-label', `Seleziona ${dataDayID}`);
  dayNumberButton.setAttribute('data-testid', `day-number-button-${dataDayID}`);

  dayNumberButton.textContent = dayNumber;

  todoContainer.classList.add(`${isMini ? 'mini' : ''}todo-container-month`);

  eventsContainer.classList.add(`${isMini ? 'monthly-events-container' : ''}`);

  return dayBox;
}

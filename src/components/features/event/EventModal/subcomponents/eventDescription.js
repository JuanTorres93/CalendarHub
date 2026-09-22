import { createCheckboxIcon } from './checkboxIcon';

export function createEventDescription() {
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

  return {
    mainComponent: descriptionRow,
    internalDomElements: {
      iconBtn,
      iconsList,
      inputTitle: titleInput,
      btnDesc: descriptionBtn,
      showDesc: descriptionArea,
      inputDesc: descriptionInput,
    },
  };
}
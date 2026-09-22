import { createCheckboxIcon } from './checkboxIcon';

export function createCategorySelector() {
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

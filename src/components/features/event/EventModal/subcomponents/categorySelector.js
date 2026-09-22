import { createCheckboxIcon } from './checkboxIcon';

const colors = [
  { name: 'Blue', value: 'blue', icon: '🟦' },
  { name: 'Green', value: 'green', icon: '🟩' },
  { name: 'Purple', value: 'purple', icon: '🟪' },
  { name: 'Red', value: 'red', icon: '🟥' },
  { name: 'Yellow', value: 'yellow', icon: '🟨' },
  { name: 'Orange', value: 'orange', icon: '🟧' },
  { name: 'Pink', value: 'pink', icon: '🩷' },
];

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

  colors.forEach((color) => {
    const item = document.createElement('li');
    item.className = 'color';
    item.dataset.color = color.value;
    item.setAttribute('aria-label', `Seleziona colore ${color.name}`);
    item.setAttribute('data-testid', `color-option-${color.value}`);
    item.innerHTML = `${color.name} <span>${color.icon}</span>`;

    colorList.appendChild(item);
  });

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

  const checkboxIcon = createCheckboxIcon();
  urgentBtn.appendChild(checkboxIcon.mainComponent);
  const urgentCheckBox = checkboxIcon.internalDomElements.checkBox;

  urgentContainer.appendChild(urgentText);
  urgentContainer.appendChild(urgentBtn);

  categoryRow.appendChild(categoryContainer);
  categoryRow.appendChild(colorList);
  categoryRow.appendChild(urgentContainer);

  return {
    mainComponent: categoryRow,
    internalDomElements: {
      categoryBtn: colorBtn,
      colorLists: colorList,
      colorPreview,
      urgentBtn,
      urgentCheckBox,
    },
  };
}
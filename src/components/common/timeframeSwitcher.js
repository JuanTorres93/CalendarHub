import { TIMEFRAMES, ITALIAN_WORDS } from '../../utils/config/config.js';

export default function createTimeframeSwitcher() {
  const container = document.createElement('div');

  container.className = 'mode-btns';
  container.setAttribute('aria-label', 'Selezione vista calendario');

  timeframes.forEach(({ id, testid, label }) => {
    const button = document.createElement('button');

    button.id = id;
    button.className = 'btns-nav';
    button.type = 'button';
    button.setAttribute('data-testid', testid);
    button.textContent = label;

    container.appendChild(button);
  });

  return container;
}

const timeframes = [
  {
    id: `${TIMEFRAMES.day}-btn`,
    testid: `${TIMEFRAMES.day}-button`,
    label: ITALIAN_WORDS.day,
  },
  {
    id: `${TIMEFRAMES.week}-btn`,
    testid: `${TIMEFRAMES.week}-button`,
    label: ITALIAN_WORDS.week,
  },
  {
    id: `${TIMEFRAMES.month}-btn`,
    testid: `${TIMEFRAMES.month}-button`,
    label: ITALIAN_WORDS.month,
  },
];

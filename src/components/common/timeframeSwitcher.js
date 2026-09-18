import { TIMEFRAMES, ITALIAN_WORDS } from '../../utils/config/config.js';
import { viewSwitcher } from '../../utils/helpers/viewSwitcher.js';
import { getAllRenderableEvents } from '../../utils/events/eventRendering.js';
import { isNow } from '../../utils/isNow.js';

export default function createTimeframeSwitcher() {
  const container = document.createElement('div');

  container.className = 'mode-btns';
  container.setAttribute('aria-label', 'Selezione vista calendario');

  Object.entries(timeframes).forEach(([key, { id, testid, label }]) => {
    const button = document.createElement('button');

    button.addEventListener('click', () => switchTimeframeView(key));

    button.id = id;
    button.className = 'btns-nav';
    button.type = 'button';
    button.setAttribute('data-testid', testid);
    button.textContent = label;

    container.appendChild(button);
  });

  return container;
}

function switchTimeframeView(timeframe) {
  viewSwitcher.switchView(timeframes[timeframe].viewIndex);

  if (timeframe === TIMEFRAMES.month) return;
}

const timeframes = {
  [TIMEFRAMES.day]: {
    id: `${TIMEFRAMES.day}-btn`,
    testid: `${TIMEFRAMES.day}-button`,
    label: ITALIAN_WORDS.day,
    viewIndex: 2,
  },
  [TIMEFRAMES.week]: {
    id: `${TIMEFRAMES.week}-btn`,
    testid: `${TIMEFRAMES.week}-button`,
    label: ITALIAN_WORDS.week,
    viewIndex: 1,
  },
  [TIMEFRAMES.month]: {
    id: `${TIMEFRAMES.month}-btn`,
    testid: `${TIMEFRAMES.month}-button`,
    label: ITALIAN_WORDS.month,
    viewIndex: 0,
  },
};

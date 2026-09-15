import { TIMEFRAMES, ITALIAN_WORDS } from '../../../utils/config/config.js';

import createCurrentTimeframeButton from './currentTimeframeButton.js';
import createLeftArrowButton from './leftArrowButton.js';
import createRightArrowButton from './rightArrowButton.js';

export default function createCurrentTimeframeDisplay(timeframeString) {
  const config = timeframeConfigs[timeframeString];

  const container = document.createElement('div');
  container.className = `display-overlay ${config.class}`;
  container.dataset.testid = `${config.testId}-display`;

  container.appendChild(
    createLeftArrowButton({
      testid: `previous-${timeframeString}-button`,
      ariaLabel: `${config.italianTimeframeString} precedente`,
    }),
  );
  container.appendChild(
    createCurrentTimeframeButton({
      timeframe: timeframeString,
    }),
  );
  container.appendChild(
    createRightArrowButton({
      testid: `next-${timeframeString}-button`,
      ariaLabel: `${config.italianTimeframeString} successivo`,
    }),
  );

  return container;
}

const timeframeConfigs = {
  month: {
    class: 'month',
    testId: TIMEFRAMES.month,
    italianTimeframeString: ITALIAN_WORDS.month,
  },
  week: {
    class: 'week',
    testId: TIMEFRAMES.week,
    italianTimeframeString: ITALIAN_WORDS.week,
  },
  day: {
    class: 'day',
    testId: TIMEFRAMES.day,
    italianTimeframeString: ITALIAN_WORDS.day,
  },
};

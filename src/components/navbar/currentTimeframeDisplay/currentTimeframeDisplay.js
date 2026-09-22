import { TIMEFRAMES, ITALIAN_WORDS } from '../../../utils/config/config.js';
import dayjs from '../../../day.js';

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
      timeFrame: timeframeString,
      ariaLabel: `${config.italianTimeframeString} precedente`,
    }),
  );
  const button = createCurrentTimeframeButton({
    timeframe: timeframeString,
  });
  container.appendChild(button);
  container.appendChild(
    createRightArrowButton({
      timeFrame: timeframeString,
      ariaLabel: `${config.italianTimeframeString} successivo`,
    }),
  );

  return {
    node: container,
    render: (date) => {
      button.textContent = config.renderText(date);
    },
  };
}

const timeframeConfigs = {
  month: {
    class: 'month',
    testId: TIMEFRAMES.month,
    italianTimeframeString: ITALIAN_WORDS.month,
    renderText: (date) => date.month(date.month()).format('MMMM'),
  },
  week: {
    class: 'week',
    testId: TIMEFRAMES.week,
    italianTimeframeString: ITALIAN_WORDS.week,
    renderText: (date) =>
      `${date.weekday(0).format('DD MMMM')} - ${date.weekday(6).format('DD MMMM')}`,
  },
  day: {
    class: 'day',
    testId: TIMEFRAMES.day,
    italianTimeframeString: ITALIAN_WORDS.day,
    renderText: (date) => date.format('DD MMMM'),
  },
};

import { TIMEFRAMES } from '../../../utils/config/config';

export default function createCurrentTimeframeButton({ timeframe }) {
  const config = timeframeConfigs[timeframe];
  const button = document.createElement('button');

  button.addEventListener('click', async (e) => {
    const { openMiniCalendar } = await import(
      '../../../miniCalendar/miniCalendarLogic.js'
    );

    openMiniCalendar('normal');
  });

  button.className = ['big-numbers text', ...config.buttonExtraClasses]
    .filter(Boolean)
    .join(' ');
  button.type = 'button';
  button.setAttribute('aria-label', 'Apri mini calendario');
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute(
    'data-testid',
    `show-${config.testId ? `${config.testId}-` : ''}mini-calendar-button`,
  );

  return button;
}

const timeframeConfigs = {
  month: {
    testId: '',
    buttonExtraClasses: [],
  },
  week: {
    testId: TIMEFRAMES.week,
    buttonExtraClasses: ['week-displayed'],
  },
  day: {
    testId: TIMEFRAMES.day,
    buttonExtraClasses: ['day-displayed'],
  },
};

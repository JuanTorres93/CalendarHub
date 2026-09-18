import createCurrentTimeframeDisplay from './common/currentTimeframeDisplay/currentTimeframeDisplay.js';
import createLeftArrowButton from './common/currentTimeframeDisplay/leftArrowButton.js';
import createRightArrowButton from './common/currentTimeframeDisplay/rightArrowButton.js';
import createViewModeSwitcher from './common/timeframeSwitcher.js';
import createTodayButton from './common/todayButton.js';
import createTodoListButton from './common/todoListButton.js';
import createTutorialButton from './common/tutorialButton.js';
import createCurrentYearDisplay from './common/currentYearDisplay.js';

const componentBuilders = {
  replace_viewModeSwitcher() {
    return createViewModeSwitcher();
  },
  replace_todayButton() {
    return createTodayButton();
  },
  replace_todoListButton() {
    return createTodoListButton();
  },
  replace_tutorialButton() {
    return createTutorialButton();
  },
  replace_currentYearDisplay() {
    return createCurrentYearDisplay();
  },
  replace_leftArrowButton(parts) {
    const [, timeFrame, ariaLabel, ...extraClasses] = parts;
    return createLeftArrowButton({ timeFrame, ariaLabel, extraClasses });
  },
  replace_rightArrowButton(parts) {
    const [, timeFrame, ariaLabel, ...extraClasses] = parts;
    return createRightArrowButton({ timeFrame, ariaLabel, extraClasses });
  },
  replace_currentTimeframeDisplay(parts) {
    const [, timeframe] = parts;
    return createCurrentTimeframeDisplay(timeframe);
  },
};

function findMarkers() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT,
    {
      acceptNode(node) {
        const value = node.nodeValue.trim();
        return Object.keys(componentBuilders).some((marker) =>
          value.startsWith(marker),
        )
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    },
  );

  const markers = [];
  while (walker.nextNode()) markers.push(walker.currentNode);
  return markers;
}

function replaceMarkers() {
  findMarkers().forEach((comment) => {
    const parts = comment.nodeValue
      .trim()
      .split('||')
      .map((part) => part.trim());
    const marker = parts[0];

    comment.replaceWith(componentBuilders[marker](parts));
  });
}

replaceMarkers();

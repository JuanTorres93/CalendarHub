import createCurrentTimeframeDisplay from './common/currentTimeframeDisplay/currentTimeframeDisplay.js';
import createLeftArrowButton from './common/currentTimeframeDisplay/leftArrowButton.js';
import createRightArrowButton from './common/currentTimeframeDisplay/rightArrowButton.js';
import createViewModeSwitcher from './common/timeframeSwitcher.js';

const componentBuilders = {
  replace_viewModeSwitcher() {
    return createViewModeSwitcher();
  },
  replace_leftArrowButton(parts) {
    const [, testid, ariaLabel, ...extraClasses] = parts;
    return createLeftArrowButton({ testid, ariaLabel, extraClasses });
  },
  replace_rightArrowButton(parts) {
    const [, testid, ariaLabel, ...extraClasses] = parts;
    return createRightArrowButton({ testid, ariaLabel, extraClasses });
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

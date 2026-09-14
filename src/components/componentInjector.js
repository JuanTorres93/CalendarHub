import createCurrentTimeframeButton from "./common/currentTimeframeButton.js";
import createLeftArrowButton from "./common/leftArrowButton.js";
import createRightArrowButton from "./common/rightArrowButton.js";

const componentBuilders = {
  replace_currentTimeframeButton(parts) {
    const [, testid, ...extraClasses] = parts;
    return createCurrentTimeframeButton({ testid, extraClasses });
  },
  replace_leftArrowButton(parts) {
    const [, testid, ariaLabel, ...extraClasses] = parts;
    return createLeftArrowButton({ testid, ariaLabel, extraClasses });
  },
  replace_rightArrowButton(parts) {
    const [, testid, ariaLabel, ...extraClasses] = parts;
    return createRightArrowButton({ testid, ariaLabel, extraClasses });
  },
};

function findMarkers() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, {
    acceptNode(node) {
      const value = node.nodeValue.trim();
      return Object.keys(componentBuilders).some((marker) => value.startsWith(marker))
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const markers = [];
  while (walker.nextNode()) markers.push(walker.currentNode);
  return markers;
}

function replaceMarkers() {
  findMarkers().forEach((comment) => {
    const parts = comment.nodeValue
      .trim()
      .split("||")
      .map((part) => part.trim());
    const marker = parts[0];

    comment.replaceWith(componentBuilders[marker](parts));
  });
}

replaceMarkers();
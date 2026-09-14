import createCurrentTimeframeButton from "./common/currentTimeframeButton.js";

const MARKER = "replace_currentTimeframeButton";

function findMarkers() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, {
    acceptNode(node) {
      return node.nodeValue.trim().startsWith(MARKER)
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
    const [, testid, ...extraClasses] = parts;

    comment.replaceWith(createCurrentTimeframeButton({ testid, extraClasses }));
  });
}

replaceMarkers();

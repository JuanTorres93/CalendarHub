export function replaceMarkers(builders) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT,
    {
      acceptNode(node) {
        const value = node.nodeValue.trim();
        return Object.keys(builders).some((marker) =>
          value.startsWith(marker),
        )
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    },
  );

  const markers = [];
  while (walker.nextNode()) markers.push(walker.currentNode);

  markers.forEach((comment) => {
    const parts = comment.nodeValue
      .trim()
      .split('||')
      .map((part) => part.trim());
    const marker = parts[0];

    comment.replaceWith(builders[marker](parts));
  });
}
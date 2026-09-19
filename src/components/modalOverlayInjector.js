import { replaceMarkers } from './markerReplacer.js';
import { createModalOverlay } from './ui/modalOverlay.js';

replaceMarkers({
  replace_modalOverlay() {
    return createModalOverlay();
  },
});
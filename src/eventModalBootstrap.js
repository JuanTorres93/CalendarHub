import { createEventModal } from './components/features/event/EventModal/EventModal.js';

const { fragment, internalDomElements } = createEventModal();
document.body.appendChild(fragment);

export const eventModalDomElements = internalDomElements;
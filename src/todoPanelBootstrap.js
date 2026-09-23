import { createTodoPanel } from './components/features/todo/todoPanel/TodoPanel.js';

const { fragment, internalDomElements } = createTodoPanel();
document.body.appendChild(fragment);

export const todoPanelDomElements = internalDomElements;
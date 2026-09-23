import createViewModeSwitcher from './timeframeSwitcher.js';
import createCurrentYearDisplay from './currentYearDisplay.js';
import createCurrentTimeframeDisplay from './currentTimeframeDisplay/currentTimeframeDisplay.js';
import createTodayButton from './todayButton.js';
import createTodoListButton from './todoListButton.js';
import createTutorialButton from './tutorialButton.js';
import { createNotificationButton } from './notificationButton.js';

export function createNavbar() {
  const navbar = document.createElement('nav');
  navbar.id = 'navbar';
  navbar.setAttribute('aria-label', 'Navigazione calendario');

  const firstLayer = document.createElement('div');
  firstLayer.id = 'first-layer';
  navbar.appendChild(firstLayer);

  const viewModeSwitcher = createViewModeSwitcher();
  firstLayer.appendChild(viewModeSwitcher);

  const yearDisplay = createCurrentYearDisplay();
  firstLayer.appendChild(yearDisplay.node);

  const layer = document.createElement('div');
  layer.id = 'layer';
  navbar.appendChild(layer);

  const monthDisplay = createCurrentTimeframeDisplay('month');
  const weekDisplay = createCurrentTimeframeDisplay('week');
  const dayDisplay = createCurrentTimeframeDisplay('day');

  layer.appendChild(monthDisplay.node);
  layer.appendChild(weekDisplay.node);
  layer.appendChild(dayDisplay.node);

  const actionBtns = document.createElement('div');
  actionBtns.className = 'action-btns';
  layer.appendChild(actionBtns);

  actionBtns.appendChild(createTodayButton());
  actionBtns.appendChild(createTodoListButton());
  actionBtns.appendChild(createTutorialButton());

  const notification = createNotificationButton();
  actionBtns.appendChild(notification.mainComponent);

  return {
    mainComponent: navbar,
    internalDomElements: {
      displayOverlays: [monthDisplay.node, weekDisplay.node, dayDisplay.node],
      displayOverlayMonth: monthDisplay.node,
      actionBtns,
      ...notification.internalDomElements,
    },
    renderDisplays: [
      monthDisplay.render,
      weekDisplay.render,
      dayDisplay.render,
      yearDisplay.render,
    ],
  };
}

export default createNavbar;
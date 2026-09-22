export function createNotificationRow() {
  const notificationRow = document.createElement('div');
  notificationRow.id = 'notification-row';

  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'notification-container';

  const notificationIcon = document.createElement('div');
  notificationIcon.className = 'notification-icon';
  notificationIcon.textContent = '⏰';

  const notificationBtn = document.createElement('button');
  notificationBtn.type = 'button';
  notificationBtn.className = 'notification-button';
  notificationBtn.setAttribute(
    'aria-label',
    'Scegli quando ricevere la notifica',
  );
  notificationBtn.setAttribute('data-testid', 'event-notification-button');
  notificationBtn.textContent = '5 minuti prima';

  const notificationList = document.createElement('ul');
  notificationList.className = 'notification-list';
  notificationList.setAttribute('data-testid', 'event-notification-list');

  notificationContainer.appendChild(notificationIcon);
  notificationContainer.appendChild(notificationBtn);
  notificationContainer.appendChild(notificationList);

  const saveContainer = document.createElement('div');
  saveContainer.id = 'save-event';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn save-btn';
  saveBtn.setAttribute('aria-label', 'Salva evento');
  saveBtn.setAttribute('data-testid', 'event-save-button');
  saveBtn.textContent = 'save';

  saveContainer.appendChild(saveBtn);

  const closeContainer = document.createElement('div');
  closeContainer.id = 'close-event';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn close-btn';
  closeBtn.setAttribute('aria-label', 'Chiudi finestra evento');
  closeBtn.setAttribute('data-testid', 'event-close-button');
  closeBtn.textContent = 'chiudi';

  closeContainer.appendChild(closeBtn);

  notificationRow.appendChild(notificationContainer);
  notificationRow.appendChild(saveContainer);
  notificationRow.appendChild(closeContainer);

  return {
    mainComponent: notificationRow,
    internalDomElements: {
      notificationBtn,
      notificationList,
      saveBtn,
      closeBtn,
    },
  };
}
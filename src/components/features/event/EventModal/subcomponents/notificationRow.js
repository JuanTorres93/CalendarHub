const notifications = [
  { name: 'nessuna notifica', value: '0' },
  { name: '5 minuti prima', value: 5 },
  { name: '15 minuti prima', value: 15 },
  { name: '1 ora prima', value: 60 },
  { name: '2 ore prima', value: 120 },
  { name: '4 ore prima', value: 240 },
  { name: '24 ore prima', value: 1440 },
];

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

  notifications.forEach((item) => {
    const option = document.createElement('li');
    option.className = 'single-notification';
    option.dataset.notification = item.value;
    option.setAttribute('aria-label', `Imposta notifica: ${item.name}`);
    option.setAttribute('data-testid', `notification-option-${item.value}`);
    option.textContent = item.name;

    notificationList.appendChild(option);
  });

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
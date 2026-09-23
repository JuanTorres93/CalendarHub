export function createNotificationButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'notifications-permission-btn';
  button.setAttribute('aria-label', 'Attiva notifiche');
  button.setAttribute('aria-pressed', 'false');

  const iconOff = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );
  iconOff.setAttribute('data-notification-icon', 'off');
  iconOff.setAttribute('aria-hidden', 'true');
  iconOff.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  iconOff.setAttribute('width', '24');
  iconOff.setAttribute('height', '24');
  iconOff.setAttribute('viewBox', '0 0 24 24');
  iconOff.setAttribute('fill', 'none');
  iconOff.setAttribute('stroke', 'currentColor');
  iconOff.setAttribute('stroke-width', '2');
  iconOff.setAttribute('stroke-linecap', 'round');
  iconOff.setAttribute('stroke-linejoin', 'round');
  iconOff.setAttribute(
    'class',
    'lucide lucide-bell-off-icon lucide-bell-off',
  );
  iconOff.innerHTML =
    '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742"/><path d="m2 2 20 20"/><path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05"/>';

  const iconOn = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  iconOn.setAttribute('data-notification-icon', 'on');
  iconOn.setAttribute('aria-hidden', 'true');
  iconOn.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  iconOn.setAttribute('width', '24');
  iconOn.setAttribute('height', '24');
  iconOn.setAttribute('viewBox', '0 0 24 24');
  iconOn.setAttribute('fill', 'none');
  iconOn.setAttribute('stroke', 'currentColor');
  iconOn.setAttribute('stroke-width', '2');
  iconOn.setAttribute('stroke-linecap', 'round');
  iconOn.setAttribute('stroke-linejoin', 'round');
  iconOn.setAttribute(
    'class',
    'lucide lucide-bell-ring-icon lucide-bell-ring',
  );
  iconOn.innerHTML =
    '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>';

  button.appendChild(iconOff);
  button.appendChild(iconOn);

  return {
    mainComponent: button,
    internalDomElements: {
      notificationPermissionBtn: button,
      notificationIconOff: iconOff,
      notificationIconOn: iconOn,
    },
  };
}
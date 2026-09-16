export function createNotificationMock() {
  const instances = [];

  class NotificationMock {
    static permission = 'default';
    static requestPermission = async () => 'granted';

    constructor(title, options = {}) {
      this.title = title;
      this.options = options;
      this.closed = false;
      this.clickHandler = null;
      instances.push(this);
    }

    addEventListener(type, handler) {
      if (type === 'click') this.clickHandler = handler;
    }

    close() {
      this.closed = true;
    }

    static getInstances() {
      return instances;
    }
  }

  return NotificationMock;
}
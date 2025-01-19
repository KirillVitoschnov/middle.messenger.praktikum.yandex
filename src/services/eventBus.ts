export default class EventBus<T = any> {
  private listeners: Record<string, ((...args: T[]) => void)[]> = {};

  on(event: string, callback: (...args: T[]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (...args: T[]) => void): void {
    if (!this.listeners[event]) {
      console.warn(`Нет события: ${event}`);
      return;
    }
    this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
  }

  emit(event: string, ...args: T[]): void {
    if (!this.listeners[event] || this.listeners[event].length === 0) {
      console.warn(`Нет слушателей для события: ${event}`);
      return;
    }

    this.listeners[event].forEach((listener) => {
      try {
        listener(...args);
      } catch (err) {
        console.error(`Ошибка при выполнении слушателя события "${event}":`, err);
      }
    });
  }
}

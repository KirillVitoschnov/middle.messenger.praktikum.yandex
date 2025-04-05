export default class EventBus<
  Events extends Record<string, unknown[]> = Record<string, unknown[]>,
> {
  private listeners: Partial<{ [K in keyof Events]: ((...args: Events[K]) => void)[] }> = {};

  on<K extends keyof Events>(event: K, callback: (...args: Events[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  off<K extends keyof Events>(event: K, callback: (...args: Events[K]) => void): void {
    if (!this.listeners[event]) {
      console.warn(`Нет события: ${String(event)}`);
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter((listener) => listener !== callback);
  }

  emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
    if (!this.listeners[event] || this.listeners[event]!.length === 0) {
      console.warn(`Нет слушателей для события: ${String(event)}`);
      return;
    }
    this.listeners[event]!.forEach((listener) => {
      try {
        listener(...args);
      } catch (err) {
        console.error(`Ошибка при выполнении слушателя события "${String(event)}":`, err);
      }
    });
  }
}

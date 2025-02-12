export class dateFormatter {
  /**
   * Форматирует дату и время для отображения в стиле популярных мессенджеров.
   * @param isoDateTime Время в формате ISO (например, "2025-01-19T12:37:47+00:00").
   * @returns Отформатированная строка (например, "Сегодня в 12:00", "Вчера", "19.01.2025").
   */
  static formatDateTime(isoDateTime: string): string {
    const date: Date = new Date(isoDateTime);
    const now: Date = new Date();

    const isToday: boolean = date.toDateString() === now.toDateString();
    const yesterday: Date = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday: boolean = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Сегодня в ${dateFormatter.formatTime(date)}`;
    }

    if (isYesterday) {
      return 'Вчера';
    }

    return dateFormatter.formatDate(date);
  }

  /**
   * Форматирует время в формате "часы:минуты".
   * @param date Объект даты.
   * @returns Время в формате "часы:минуты".
   */
  static formatTime(date: Date): string {
    const hours: string = String(date.getHours()).padStart(2, '0');
    const minutes: string = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Форматирует дату в формате "день.месяц.год".
   * @param date Объект даты.
   * @returns Дата в формате "день.месяц.год".
   */
  static formatDate(date: Date): string {
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const year: number = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
}

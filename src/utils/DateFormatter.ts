/**
 * Класс для форматирования дат и времени.
 */
export class DateFormatter {
    /**
     * Форматирует дату и время для отображения в стиле популярных мессенджеров.
     * @param {string} isoDateTime Время в формате ISO (например, 2025-01-19T12:37:47+00:00).
     * @returns {string} Отформатированная строка (например, "Сегодня в 12:00", "Вчера", "19.01.2025").
     */
    static formatDateTime(isoDateTime) {
        const date = new Date(isoDateTime); // Преобразуем ISO-строку в объект Date
        const now = new Date();

        const isToday = date.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();

        if (isToday) {
            return `Сегодня в ${this.formatTime(date)}`;
        }

        if (isYesterday) {
            return 'Вчера';
        }

        // Если сообщение старше, показываем дату в формате "день.месяц.год"
        return this.formatDate(date);
    }

    /**
     * Форматирует время в формате "часы:минуты".
     * @param {Date} date Объект даты.
     * @returns {string} Время в формате "часы:минуты".
     */
    static formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Форматирует дату в формате "день.месяц.год".
     * @param {Date} date Объект даты.
     * @returns {string} Дата в формате "день.месяц.год".
     */
    static formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
}

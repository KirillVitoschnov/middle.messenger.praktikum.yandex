/**
 * Форматирует дату и время для отображения в стиле популярных мессенджеров.
 * @param isoDateTime Время в формате ISO (например, "2025-01-19T12:37:47+00:00").
 * @returns Отформатированная строка (например, "Сегодня в 12:00", "Вчера", "19.01.2025").
 */
export function formatDateTime(isoDateTime: string): string {
  // Преобразуем входящую строку ISO в объект Date
  const date: Date = new Date(isoDateTime);
  // Получаем текущую дату и время
  const now: Date = new Date();

  // Проверяем, совпадает ли дата с сегодняшней датой
  const isToday: boolean = date.toDateString() === now.toDateString();

  // Определяем дату "вчера"
  const yesterday: Date = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday: boolean = date.toDateString() === yesterday.toDateString();

  // Вспомогательная функция для форматирования времени
  function formatTime(date: Date): string {
    const hours: string = String(date.getHours()).padStart(2, '0');
    const minutes: string = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Вспомогательная функция для форматирования даты
  function formatDate(date: Date): string {
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const year: number = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Формируем итоговую строку в зависимости от того, является ли дата сегодняшней, вчерашней или иной
  if (isToday) {
    return `Сегодня в ${formatTime(date)}`;
  }

  if (isYesterday) {
    return 'Вчера';
  }

  return formatDate(date);
}

/**
 * Функция для глубокого клонирования объекта или значения.
 *
 * @template T – тип клонируемого значения.
 * @param {T} obj – объект или значение, которое необходимо клонировать.
 * @returns {T} – глубоко клонированное значение.
 */
export function deepClone<T>(obj: T): T {
  // Если obj равен null или не является объектом, возвращаем его без изменений.
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Если obj является массивом, создаём новый массив и рекурсивно клонируем каждый его элемент.
  if (Array.isArray(obj)) {
    const copy: any[] = [];
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy as unknown as T;
  }

  // Если obj является объектом, создаём новый объект и рекурсивно копируем все его собственные свойства.
  const copy = {} as { [key: string]: any };
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone((obj as { [key: string]: any })[key]);
    }
  }
  return copy as T;
}

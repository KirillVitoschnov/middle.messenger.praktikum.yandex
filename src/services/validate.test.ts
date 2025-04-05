import { assert } from 'chai';
import { validate, validateForm } from './validate';

describe('Тестирование функций валидации', () => {
  let parent: HTMLElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    parent = document.createElement('div');
    input = document.createElement('input');
    parent.appendChild(input);
    document.body.appendChild(parent);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Должен возвращать ошибку для обязательного поля, если оно пустое', () => {
    input.dataset.required = 'true';
    input.value = '';

    const result = validate(input);

    assert.isFalse(result, 'Ожидается false для пустого обязательного поля');

    assert.isTrue(parent.classList.contains('error'), 'Родитель должен содержать класс "error"');
    const errorSpan = parent.querySelector('.text-error');
    assert.exists(errorSpan, 'Ошибка должна быть добавлена');
    assert.equal(
      errorSpan?.textContent,
      'Обязательное поле',
      'Текст ошибки должен соответствовать',
    );
  });

  it('Должен успешно валидировать корректное поле', () => {
    input.dataset.required = 'true';
    input.value = 'Корректное значение';

    const result = validate(input);

    assert.isTrue(result, 'Ожидается true для заполненного обязательного поля');
    assert.isFalse(parent.classList.contains('error'), 'Класс "error" не должен присутствовать');
    const errorSpan = parent.querySelector('.text-error');
    assert.notExists(errorSpan, 'Элемент с ошибкой не должен быть создан');
  });

  it('Должен проверять правило минимальной длины', () => {
    input.dataset.minLength = '5';
    input.value = 'abc';

    const result = validate(input);

    assert.isFalse(result, 'Ожидается false, если длина меньше минимальной');
    const errorSpan = parent.querySelector('.text-error');
    assert.exists(errorSpan, 'Элемент с ошибкой должен быть создан');
    assert.equal(
      errorSpan?.textContent,
      'Минимальное число символов: 5',
      'Текст ошибки должен содержать минимальную длину',
    );
  });

  it('Должен валидировать форму с несколькими полями', () => {
    const form = document.createElement('form');
    const input1 = document.createElement('input');
    input1.dataset.required = 'true';
    input1.value = 'Текст';
    const input2 = document.createElement('input');
    input2.dataset.required = 'true';
    input2.value = '';
    form.appendChild(input1);
    form.appendChild(input2);
    document.body.appendChild(form);
    const event = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { value: form, writable: false });
    const result = validateForm(event);
    assert.isFalse(
      result,
      'Форма должна быть невалидной, если хотя бы одно поле не прошло проверку',
    );
    input2.value = 'Заполнено';
    const result2 = validateForm(event);
    assert.isTrue(result2, 'Форма должна пройти валидацию, если все поля валидны');
    document.body.removeChild(form);
  });
});

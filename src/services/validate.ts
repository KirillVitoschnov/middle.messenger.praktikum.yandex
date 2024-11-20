function removeError(element: HTMLElement): void {
  const parentElement = element.parentNode as HTMLElement;
  if (parentElement.classList.contains('error')) {
    parentElement.querySelectorAll('.text-error').forEach((errorSpan) => errorSpan.remove());
    parentElement.classList.remove('error');
  }
}

function createError(element: HTMLElement, text: string): void {
  const parentElement = element.parentNode as HTMLElement;
  parentElement.classList.add('error');
  const errorTextElement = document.createElement('span');
  errorTextElement.classList.add('text-error');
  errorTextElement.textContent = text;
  parentElement.append(errorTextElement);
}

function executeRules(element: HTMLInputElement): [boolean, string] {
  const {
    required,
    minLength,
    maxLength,
    validName,
    validLogin,
    validEmail,
    validPassword,
    validPhone,
  } = element.dataset;

  if (required && element.value === '') return [false, 'Обязательное поле'];
  if (minLength && element.value.length < Number(minLength))
    return [false, `Минимальное число символов: ${minLength}`];
  if (maxLength && element.value.length > Number(maxLength))
    return [false, `Максимальное число символов: ${maxLength}`];
  if (validName && !/^[A-ZА-Я][a-zа-я-]*$/.test(element.value))
    return [false, 'Только латиница или кириллица (первая буква заглавная)'];
  if (validLogin && !/^(?!\d+$)[A-Za-z0-9_-]+$/.test(element.value))
    return [false, 'Только латиница без спецсимволов (только - и _)'];
  if (validEmail && !/^[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.[A-Za-z]+$/.test(element.value))
    return [false, 'Недопустимые значения. Пример: example@gmail.com'];
  if (validPassword && !/^(?=.*[A-Z])(?=.*\d)[^\s]+$/.test(element.value))
    return [false, 'Обязательно хотя бы одна заглавная буква и цифра'];
  if (validPhone && !/^\+?\d+$/.test(element.value))
    return [false, 'Только цифры, может начинаться с +'];

  return [true, ''];
}

export function validate(element: HTMLInputElement): boolean {
  removeError(element);
  const [isValid, msg] = executeRules(element);
  if (!isValid) createError(element, msg);
  return isValid;
}

export function validateForm(event: Event): boolean {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  let validFormlist: boolean[] = [];
  const elements = form.querySelectorAll('input, select, checkbox, textarea');
  elements.forEach((element) => {
    validate((element as HTMLInputElement) || HTMLTextAreaElement);
    validFormlist.push(validate((element as HTMLInputElement) || HTMLTextAreaElement));
  });

  if (!validFormlist.includes(false)) {
    return true;
  } else {
    return false;
  }
}

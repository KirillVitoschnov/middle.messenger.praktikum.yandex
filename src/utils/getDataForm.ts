export function getDataForm(event: Event) {
  const form = event.target as HTMLFormElement;
  const elements = form.querySelectorAll('input, select, textarea');
  const data: { [key: string]: any } = {};

  elements.forEach((element) => {
    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox') {
        data[element.name] = element.checked ? element.value : false;
      } else {
        data[element.name] = element.value;
      }
    } else if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
      data[element.name] = element.value;
    }
  });

  return data;
}

export function getDataForm(event: Event) {
  const form = event.target as HTMLFormElement;
  const elements = form.querySelectorAll('input, select, checkbox, textarea');
  const data: { [key: string]: string } = {};
  elements.forEach((element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    ) {
      data[element.name] = element.value;
    }
  });

  return data;
}

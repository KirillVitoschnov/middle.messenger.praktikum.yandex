export function addActiveClass(event: Event): void {
  event.preventDefault();
  const currentElement = event.target as HTMLElement;
  const elements = document.querySelectorAll('.chat-block');
  elements.forEach((item) => {
    item.classList.remove('active');
  });

  currentElement?.closest('.chat-block')!.classList.add('active');
}

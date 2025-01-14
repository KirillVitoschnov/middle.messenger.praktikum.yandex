export function render(query: string, block: any): Element | null {
  const root = document.querySelector(query);
  if (root) {
    root.appendChild(block.getContent() as Node);
    block.dispatchComponentDidMount();
  }
  return root;
}

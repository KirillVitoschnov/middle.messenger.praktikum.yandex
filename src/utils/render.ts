import {Renderable} from "../types";

export function render(query: string, block: Renderable): Element | null {
  const root = document.querySelector(query);
  if (root) {
    root.appendChild(block.getContent());
    block.dispatchComponentDidMount();
  }
  return root;
}

export const findClosestTreeNode = (el: HTMLElement | null): Element | null => {
  return el?.closest('[data-id]') || null;
};

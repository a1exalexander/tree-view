export const findClosestTreeNodeId = (el: HTMLElement | null): string | null => {
  return el?.closest('[data-id]')?.getAttribute('data-id') || null;
};

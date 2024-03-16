export const findClosestFolder = (el: HTMLElement | null): Element | null => {
  return el?.closest('.folder') || null;
};

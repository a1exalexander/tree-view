export const findClosestFolderId = (el: HTMLElement | null): string | null => {
  return el?.closest('.folder')?.getAttribute('data-id') || null;
};

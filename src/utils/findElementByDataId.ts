export const findElementByDataId = (id: string): Element | null  => {
  return document.querySelector(`[data-id="${id}"]`);
};

type ClassesType = string | Record<string, boolean> | undefined | null | false;

export const clsx = (...classes: ClassesType[]): string => {
  return classes
    .map((el) => {
      if (typeof el === 'string') {
        return el;
      }
      if (typeof el === 'object' && el !== null) {
        return Object.entries(el).reduce((acc, [key, value]) => {
          if (value) {
            return `${acc} ${key}`;
          }
          return acc;
        }, '');
      }
      return '';
    })
    .join(' ');
};

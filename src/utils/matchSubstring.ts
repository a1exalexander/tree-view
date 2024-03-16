export const matchSubstring = (str: string, substr: string): boolean => {
  return str.toLowerCase().includes(substr.toLowerCase());
};

export const capitalize = (s: string) => {
  const str = s.toLowerCase();
  return s[0].toUpperCase() + str.slice(1);
};

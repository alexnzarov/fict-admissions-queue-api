export const pick = <T>(obj: T, keys: (keyof T)[]) => {
  const temp: Partial<T> = {};
  
  for (let key of keys) {
    temp[key] = (key in obj) ? obj[key] : null;
  }

  return temp;
};

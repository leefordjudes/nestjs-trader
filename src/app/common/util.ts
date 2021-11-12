export const textFormatter = (obj: string): string => {
  if (typeof obj === 'string') {
    return obj ? obj.replace(/[^a-z0-9]/gi, '').toLowerCase() : '';
  }
  return '';
};

export const crossValidateCondition = (data: any, keys: string[]) => {
  const condition = [];
  for (let i = 0; i < keys.length; i++) {
    if (data[keys[i]]) {
      for (const key of keys) {
        const obj: any = {};
        obj[key] = data[keys[i]];
        condition.push(obj);
      }
    }
  }
  return condition;
};

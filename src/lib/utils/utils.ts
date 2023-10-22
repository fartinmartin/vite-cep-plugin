export const unique = (array: any) => {
  return array.filter((v: string, i: number, a: string) => a.indexOf(v) === i);
};

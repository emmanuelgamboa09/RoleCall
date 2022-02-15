// Arrays contain same set/frequency of values
export const arraysEqual = (array1: any[], array2: any[]) => {
  return array1.sort().join(",") === array2.sort().join(",");
};

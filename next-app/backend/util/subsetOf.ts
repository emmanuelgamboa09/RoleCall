// Returns true if array1 is a subset of array2
export const subsetOf = (array1: any[], array2: any[]) => {
  return array1.every((val) => array2.includes(val));
};

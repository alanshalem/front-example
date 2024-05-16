/**
 * @name isLastChild
 * @description validate in iteration if the current element of the array is the last
 * @param array - any array
 * @param currentIdx - current index on iteration
 * @returns
 * @example - isLastChild(['A', 'B'], 0) // false
 */
export const isLastChild = (currentIdx: number, array: any[] = []): boolean => {
  return currentIdx === array.length - 1;
};

type PrimitivesArray = (string | number)[];

/**
 * @name arrayUnique
 * @description remove duplicated array values
 * @param array - any array with primitives values
 * @returns
 * @example - arrayUnique(['A', 'B', 'B', 'A', 'C']) // ['A', 'B', 'C']
 */
export const arrayUnique = (array: PrimitivesArray = []): PrimitivesArray => {
  return array.filter((item, idx, arr) => arr.indexOf(item) === idx);
};

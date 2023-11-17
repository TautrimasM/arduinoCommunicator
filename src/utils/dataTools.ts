export function areObjectsEqual(
  obj1: any,
  obj2: any,
  deadband?: number
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      if (
        typeof obj1[key] == "number" &&
        typeof obj2[key] == "number" &&
        deadband != undefined
      ) {
        if (Math.abs(obj1[key] - obj2[key]) < deadband) {
          continue;
        }
      }
      return false;
    }
  }

  return true;
}

export function hasDefinedNumberOfCommas(
  str: string,
  numberOfCommas: number
): boolean {
  const commaMatches = str.match(/,/g);
  return commaMatches ? commaMatches.length === numberOfCommas : false;
}

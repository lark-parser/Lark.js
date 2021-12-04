/**
 * @param {*} item
 */
export function inspect(item) {
  return JSON.stringify(item, null, 0);
}

/**
 * @param {*} obj
 */
export function isMap(obj) {
  return self[Symbol.toStringTag] === "Map";
}
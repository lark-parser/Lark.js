import util from "util";

/**
 * @param {*} item
 * @returns {string}
 */
export function inspect(item) {
  return util.inspect(item, false, null, true);
}

/**
 * @param {*} obj
 */
export function isMap(obj) {
  return util.isMap(obj);
}
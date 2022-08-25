import { isRef, unref } from 'vue'

const isObject = (val: any) => val !== null && typeof val === 'object'
const isArray = Array.isArray

/**
 * Unref a value, recursing into it if it's an object.
 */
const smartUnref = (val: any) => {
  // Non-ref object?  Go deeper!
  if (val !== null && !isRef(val) && typeof val === 'object')
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return deepUnref(val)

  return unref(val)
}
/**
 * Unref an array, recursively.
 *
 * @param {Array} arr - The array to unref.
 *
 * @return {Array}
 */
const unrefArray = (arr: any) => {
  const unreffed: any[] = []

  arr.forEach((val: any) => {
    unreffed.push(smartUnref(val))
  })

  return unreffed
}

/**
 * Unref an object, recursively.
 *
 * @param {Object} obj - The object to unref.
 *
 * @return {Object}
 */
const unrefObject = (obj: any) => {
  const unreffed: any = {}

  Object.keys(obj).forEach((key) => {
    unreffed[key] = smartUnref(obj[key])
  })

  return unreffed
}

/**
 * Deeply unref a value, recursing into objects and arrays.
 */
export const deepUnref = (val: any) => {
  const checkedVal = isRef(val) ? unref(val) : val

  if (!isObject(checkedVal))
    return checkedVal

  if (isArray(checkedVal))
    return unrefArray(checkedVal)

  return unrefObject(checkedVal)
}


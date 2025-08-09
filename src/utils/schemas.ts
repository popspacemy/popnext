/**
 * Creates a pick shape object from the keys of a default object
 * to use with Zod's .pick() method
 */
export function createPickShape<T extends Record<string, any>>(
  defaultObject: T
): { [K in keyof T]: true } {
  return Object.fromEntries(Object.keys(defaultObject).map((key) => [key, true])) as {
    [K in keyof T]: true
  }
}

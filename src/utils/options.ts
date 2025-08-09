/**
 * Helper functions to reduce repetition
 */
export type ExtractUnionFromOptions<T extends readonly { value: string }[]> = T[number]["value"]

/**
 * Helper function to extract values from an options object
 */
export const extractValuesFromOptions = <T extends readonly { readonly value: string }[]>(
  arr: T
): T[number]["value"][] => arr.map((item) => item.value)

/**
 * Helper function to create an enum-like object from an options object
 */
export const createEnumFromOptions = <T extends readonly { readonly value: string }[]>(
  arr: T
): Record<T[number]["value"], T[number]["value"]> => {
  const result = {} as Record<T[number]["value"], T[number]["value"]>

  for (const option of arr) {
    result[option.value as T[number]["value"]] = option.value
  }

  return result
}

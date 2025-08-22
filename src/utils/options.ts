// Type utility to convert string literal to PascalCase
// This preserves camelCase boundaries while handling separators
type ToPascalCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Lowercase<First>
    ? `${Uppercase<First>}${ProcessRest<Rest>}`
    : `${First}${ProcessRest<Rest>}`
  : ""

type ProcessRest<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends "-" | "_" | " "
    ? ToPascalCase<Rest> // Found separator, capitalize next part
    : `${First}${ProcessRest<Rest>}` // Keep character as is (preserves camelCase)
  : ""

// Type to create the enum record with proper keys
type EnumFromOptions<T extends readonly { readonly value: string }[]> = {
  [K in T[number]["value"] as ToPascalCase<K>]: K
}

// Runtime utility function to convert string to PascalCase enum key
const toPascalCaseKey = (value: string): string => {
  return (
    value
      // First handle separators: replace hyphens, underscores, and spaces with a delimiter
      .replace(/[-_\s]+/g, "|")
      // Split by the delimiter and process each part
      .split("|")
      .map((part) => {
        if (!part) return ""
        // For each part, capitalize first letter and keep the rest as is (preserves camelCase)
        return part.charAt(0).toUpperCase() + part.slice(1)
      })
      .join("")
  )
}

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
 * Helper function to extract values from constant objects
 */
export function extractValuesFromConstants<T extends Record<string, string>, V extends T[keyof T]>(
  constObj: T
): V[] {
  return Object.values(constObj) as V[]
}

/**
 * Helper function to create an enum-like object from an options object
 */
export const createEnumFromOptions = <T extends readonly { readonly value: string }[]>(
  arr: T
): EnumFromOptions<T> => {
  const result = {} as EnumFromOptions<T>

  for (const option of arr) {
    const enumKey = toPascalCaseKey(option.value) as keyof EnumFromOptions<T>
    result[enumKey] = option.value as EnumFromOptions<T>[keyof EnumFromOptions<T>]
  }

  return result
}

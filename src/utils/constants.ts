/**
 * Helper function to extract union type from constants object
 */
export type ExtractUnionFromConstants<T> = T[keyof T]

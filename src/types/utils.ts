export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type AnyObject = Record<string, any>

export type UnknownObject = Record<string, unknown>

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

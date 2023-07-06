export function joinString<T extends string[]>(...strings: T): Concat<T> {
    return strings.join("") as Concat<T>;
  }

  export type Concat<T extends string[]> = T extends [
    infer F,
    ...infer R
  ]
    ? F extends string
      ? R extends string[]
        ? `${F}${Concat<R>}`
        : never
      : never
    : '';
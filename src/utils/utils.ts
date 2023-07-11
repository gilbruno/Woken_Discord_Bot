import { Template } from "../templates/types";

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


export function buildNotificationText(templates: Template, eventName: string, replacements: any) {
  let template = templates[eventName]
  for (const key in replacements) {
    template = template.replace(`{{${key}}}`, replacements[key])
  }
  return template
}    
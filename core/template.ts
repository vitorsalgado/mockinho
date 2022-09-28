export type Helper = {
  [name: string]: (...args: Array<never>) => string | number | boolean
}

export type TemplateDelegate<M, H extends Helper = Helper> = (
  context: M,
  helpers: H,
) => Promise<string>

export interface Template<M, H extends Helper = Helper> {
  compile(input: string): TemplateDelegate<M, H>
}

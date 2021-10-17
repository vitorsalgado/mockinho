export interface Args<C> {
  readonly service: string
  readonly serviceMethod: string
  readonly path: string
  readonly call: C
}

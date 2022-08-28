export class RpcCallArgs<C, T = unknown> {
  constructor(
    public readonly service: string,
    public readonly serviceMethod: string,
    public readonly path: string,
    public readonly call: C,
    public readonly data: T,
  ) {}
}

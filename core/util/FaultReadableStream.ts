import { Buffer } from 'buffer'
import { Readable } from 'stream'

export class FaultReadableStream extends Readable {
  constructor(private readonly chunks: Array<any>, private readonly faultPromise: Promise<void>) {
    super()
  }

  _read(_size: number): void {
    if (this.chunks.length === 0) {
      this.push(null)
      return
    }

    this.pause()

    this.faultPromise.finally(() => {
      this.push(Buffer.from(this.chunks.shift()))
      this.resume()
    })
  }
}

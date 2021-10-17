import { FindMockResult } from '@mockdog/core'
import { RpcMock } from './RpcMock'

export function noMatchErrorMessage(result: FindMockResult<RpcMock>): string {
  return (
    `Unmatched Request.${result
      .closestMatch()
      .map(() => ' See closest matches below:')
      .orValue('')}` +
    result
      .closestMatch()
      .map(x => [{ id: x.id, name: x.name, filename: x.sourceDescription }])
      .orValue([])
      .map(item => `\nName: ${item.name}\nId: ${item.id}\nFile: ${item.filename}`)
      .join('')
  )
}

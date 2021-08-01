import { Context } from './Context'
import { FindStubResult } from './FindStubResult'
import { Stub } from './Stub'
import { StubRepository } from './StubRepository'

export function findStubForRequest<Request, ResponseDefinition, Config>(
  request: Request,
  context: Context<
    Config,
    StubRepository<Request, ResponseDefinition, Stub<Request, ResponseDefinition>>
  >
): FindStubResult<Request, ResponseDefinition> {
  const stubRepository = context.provideStubRepository()
  const stubs = stubRepository.fetchSorted()

  const stubWeight = new Map<string, number>()

  for (const stub of stubs) {
    const ctx = { stub, context: context, req: request }
    let weight = 0

    if (
      stub.expectations.every(expectation => {
        const hasMatch = expectation.matcher(expectation.valueGetter(request), ctx)

        if (hasMatch) {
          weight *= expectation.weight
          stubWeight.set(stub.id, weight)
        }

        return hasMatch
      })
    ) {
      stub.hit()
      stubRepository.save(stub)

      return FindStubResult.match(stub)
    }
  }

  if (stubWeight.size === 0) {
    return FindStubResult.noMatch()
  }

  const keys = Array.from(stubWeight)
    .sort((a, b) => b[1] - a[1])
    .shift()?.[0]

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return FindStubResult.noMatch(stubRepository.fetchById(keys![0]).get())
}

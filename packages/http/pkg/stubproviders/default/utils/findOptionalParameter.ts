export function findOptionalParameter<T>(
  parameter: string,
  values: [string, unknown][],
  def: T
): T {
  const entry = values.find(([k]) => k === parameter)

  if (!entry) {
    return def
  }

  return entry[1] as T
}

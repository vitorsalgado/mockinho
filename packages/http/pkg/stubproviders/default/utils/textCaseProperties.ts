export function textCaseProperties(
  root: any,
  def: boolean = false
): { ignoreCase: boolean; locale: string | string[] | undefined } {
  const locale = root.locale as string | string[] | undefined
  let ignoreCase = def

  if (root.ignoreCase) {
    ignoreCase = root.ignoreCase
  } else if (root.caseInsensitive) {
    ignoreCase = root.caseInsensitive
  }

  return {
    ignoreCase,
    locale
  }
}

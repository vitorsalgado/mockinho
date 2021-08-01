export const getQueryParam = (url: string): string =>
  url.substring(url.indexOf('?') + 1, url.length)

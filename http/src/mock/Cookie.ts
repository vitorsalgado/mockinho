import { CookieOptions } from 'express'

export interface Cookie {
  key: string
  value: string
  options?: CookieOptions
}

export interface ClearCookie {
  key: string
  options?: CookieOptions
}

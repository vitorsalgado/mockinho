import { CookieOptions } from 'express'

export interface Cookie {
  key: string
  value: string
  options?: CookieOptions
}

export interface CookieToClear {
  key: string
  options?: CookieOptions
}

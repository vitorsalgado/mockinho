import { Helper } from './Helper'

export interface TemplateParseDelegate<M, H extends Helper = Helper> {
  (context: M, helpers: H): Promise<string>
}

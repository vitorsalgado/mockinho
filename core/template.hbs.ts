import { compile } from 'handlebars'
import { Helper, Template, TemplateDelegate } from './template.js'

export class HandlebarsTemplating<M, H extends Helper = Helper> implements Template<M, H> {
  compile(input: string): TemplateDelegate<M, H> {
    return function (model: M, helpers: H) {
      return Promise.resolve(compile(input)(model, { helpers }))
    }
  }
}

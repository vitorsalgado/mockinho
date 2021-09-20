import { compile } from 'handlebars'
import { Templating } from './Templating'
import { TemplatingContext } from './TemplatingContext'
import { CustomHelper } from './CustomHelper'
import { Delegate } from './Delegate'

export class HandlebarsTemplating implements Templating {
  compile(input: string): Delegate {
    const template = compile(input)

    return function (context: TemplatingContext, helpers: CustomHelper) {
      return Promise.resolve(template(context, { helpers }))
    }
  }
}

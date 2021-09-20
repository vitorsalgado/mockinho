import { TemplatingContext } from './TemplatingContext'
import { CustomHelper } from './CustomHelper'

export type Delegate = (context: TemplatingContext, helpers: CustomHelper) => Promise<string>

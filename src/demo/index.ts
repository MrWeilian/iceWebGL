import { baseComponents } from './basic'
import type { App, Plugin } from 'vue'

const INSTALLED_KEY = Symbol('INSTALLED_KEY')

const components = [
  ...baseComponents
]

const install = (app: App) => {
  if (app[INSTALLED_KEY]) return

  app[INSTALLED_KEY] = true
  components.forEach((c) => app.component(c.name, c))
}

const installer = {
  install
}

export default installer

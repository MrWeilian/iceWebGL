import { secondComponents } from './second'
import { thirdComponents } from './third'
import { fourthComponents } from './fourth'
import { fifthComponents } from './fifth'
import { sixthComponents } from './sixth'
import type { App, Plugin } from 'vue'

const INSTALLED_KEY = Symbol('INSTALLED_KEY')

const components = [
  ...secondComponents,
  ...thirdComponents,
  ...fourthComponents,
  ...fifthComponents,
  ...sixthComponents,
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

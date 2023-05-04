import Theme from 'vitepress/theme'
import '../../public/css/index.css'
import { globals } from '../components'
import { App, Component } from 'vue'

export default {
  ...Theme,
  enhanceApp ({ app }: {app: App}) {
    globals.forEach((comp: Component) => {
      app.component(comp.name as string, comp)
    })
  }
}

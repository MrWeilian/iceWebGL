import Theme from 'vitepress/theme'
import '../../public/css/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { globals } from '../components'
import { App, Component } from 'vue'
import DemoInstaller from '@ice-webgl/demo'

export default {
  ...Theme,
  enhanceApp ({ app }: {app: App}) {
    app.use(DemoInstaller)

    globals.forEach((comp: Component) => {
      app.component(comp.name, comp)
    })
  }
}

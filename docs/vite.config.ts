import createSideBar from './scripts/create-side-bar'
import createDirectory from './scripts/create-directory'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    createSideBar(),
    createDirectory(),
    Components({
      resolvers: [ElementPlusResolver({ ssr: true })],
    })
  ],
  resolve: {

  }
}

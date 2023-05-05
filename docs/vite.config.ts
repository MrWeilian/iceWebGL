import createSideBar from './scripts/create-side-bar'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    createSideBar(),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {

  }
}

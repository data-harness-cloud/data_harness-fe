import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite' // 不加这个配置，ElMessage出不来
import createVitePlugins from './vite/plugins'

// https://vitejs.dev/config/
export default ({ mode, command }) => {
  console.log("let's start...")
  console.log('mode = ', mode)
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return defineConfig({
    plugins: [
      ...createVitePlugins(env, command === 'build'),
      // 按需引入，主题色的配置，需要加上 importStyle: 'sass'
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
      }),
      ElementPlus(),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    server: {
      port: 8111,
      host: true,
      open: true,
    },
    optimizeDeps: {
      include: [
        'vue',
        '@element-plus/icons-vue',
        'pinia',
        'axios',
        'vue-request',
        'vue-router',
        '@vueuse/core',
        'element-plus/es/components/**/style/index',
      ],
    },
  })
}

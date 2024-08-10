import iconTw from '../src/module'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  typescript: { strict: true, includeWorkspace: true },
  iconTw: {
    size: false,
    prefix: '',
    customCollections: resolve('./custom.json'),
  },
  modules: [iconTw, '@nuxtjs/tailwindcss', '@nuxt/devtools'],
  compatibilityDate: '2024-08-09',
})

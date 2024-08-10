import { defineNuxtPlugin, useRuntimeConfig, useAppConfig } from '#app'
import { defu } from 'defu'
import type { TailwindIconsModuleOptions } from '../module'

// copy the runtime config to appconfig
export default defineNuxtPlugin((_nuxtApp) => {
  const options = useRuntimeConfig().public
    .tailwindIcons as TailwindIconsModuleOptions

  const appConfig = useAppConfig()

  // appConfig overrides module settings in nuxt config, except for resolvedPrefixes
  appConfig.iconTw = defu(options, appConfig.iconTw) as any

  if (appConfig.iconTw)
    appConfig.iconTw.resolvedPrefixes = options?.resolvedPrefixes
})

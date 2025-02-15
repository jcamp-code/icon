import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addPlugin,
  addTemplate,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { IconsTailwindPluginOptions } from './runtime/tailwindcss-icons/types'
import { getAllPrefixes } from './runtime/tailwindcss-icons/core'
import type { NuxtModule } from '@nuxt/schema'

export type TailwindIconsModuleOptions = {
  /**
   * Only allow tailwind generated icons; do not use icones API to retrieve them
   *
   * @default false
   */
  tailwindOnly?: boolean
} & IconsTailwindPluginOptions

// Learn how to create a Nuxt module on https://nuxt.com/docs/guide/going-further/modules/
const module: NuxtModule<TailwindIconsModuleOptions> =
  defineNuxtModule<TailwindIconsModuleOptions>({
    meta: {
      name: 'nuxt-icon-tw',
      configKey: 'iconTw',
      compatibility: {
        nuxt: '>=3.0.0',
      },
    },
    defaults: {
      tailwindOnly: false,
      resolvedPrefixes: [],
      prefix: 'i',
      size: '1em',
    } as TailwindIconsModuleOptions,
    setup(options, nuxt) {
      const { resolve } = createResolver(import.meta.url)

      const twConfigTemplate = addTemplate({
        filename: 'nuxt-icon-tw-plugin-config.ts',
        write: true,
        getContents: () => `
        import { iconsTailwindPlugin } from ${JSON.stringify(
          resolve('./runtime/tailwindcss-icons')
        )}
        export default { plugins: [iconsTailwindPlugin(${JSON.stringify(
          options
        )})] }
      `,
      })

      //@ts-ignore tailwindcss added by tailwindcss plugin
      nuxt.options.tailwindcss = (nuxt.options?.tailwindcss ?? {}) as any
      //@ts-ignore tailwindcss added by tailwindcss plugin
      if (!Array.isArray(nuxt.options.tailwindcss?.configPath)) {
        //@ts-ignore tailwindcss added by tailwindcss plugin
        nuxt.options.tailwindcss!.configPath = [
          //@ts-ignore tailwindcss added by tailwindcss plugin
          nuxt.options.tailwindcss?.configPath || 'tailwind.config',
        ]
      }

      //@ts-ignore tailwindcss added by tailwindcss plugin
      nuxt.options.tailwindcss!.configPath.unshift(twConfigTemplate.dst)

      const iconPluginOptions = defu(
        nuxt.options.runtimeConfig.public.tailwindIcons as any,
        options
      )
      const collectionPrefixes = getAllPrefixes(iconPluginOptions)
      iconPluginOptions.resolvedPrefixes = collectionPrefixes

      // setup collections here from config
      nuxt.options.runtimeConfig.public.tailwindIcons = iconPluginOptions

      // Define types for the app.config compatible with Nuxt Studio
      nuxt.hook('schema:extend', (schemas) => {
        schemas.push({
          appConfig: {
            iconTw: {
              $schema: {
                title: 'Nuxt Icon Tailwind',
                description: 'Configure the defaults of Nuxt Icon Tailwind',
              },
              size: {
                $default: '1em',
                $schema: {
                  title: 'Icon Size',
                  description:
                    'Set the default icon size. Set to false to disable the sizing of icon in style. Number is px',
                  tags: ['@studioIcon material-symbols:format-size-rounded'],
                  tsType: 'string | number | false',
                },
              },
              class: {
                $default: '',
                $schema: {
                  title: 'CSS Class',
                  description: 'Set the default CSS class',
                  tags: ['@studioIcon material-symbols:css'],
                },
              },
              aliases: {
                $default: {},
                $schema: {
                  title: 'Icon aliases',
                  description:
                    'Define Icon aliases to update them easily without code changes.',
                  tags: [
                    '@studioIcon material-symbols:star-rounded',
                    '@studioInputObjectValueType icon',
                  ],
                  tsType: '{ [alias: string]: string }',
                },
              },
              iconifyApiOptions: {
                url: {
                  $default: 'https://api.iconify.design',
                  $schema: {
                    title: 'Iconify API URL',
                    description:
                      'Define a custom Iconify API URL. Useful if you want to use a self-hosted Iconify API. Learn more: https://iconify.design/docs/api/',
                  },
                },
                publicApiFallback: {
                  $default: false,
                  $schema: {
                    title: 'Public Iconify API fallback',
                    description:
                      'Define, if the public Iconify API should be used as fallback if the .',
                  },
                },
              },
              prefix: {
                $default: 'i',
                $schema: {
                  title: 'Tailwind Class Prefix',
                  description:
                    'Set the Tailwind class prefix; leave bank or null to not use a prefix. Can also set in ',
                },
              },
              resolvedPrefixes: {
                $default: [],
                $schema: {
                  title: 'Resolved Prefixes',
                  description:
                    'All of the icon collections loaded by Tailwind.',
                  tsType: 'string[]',
                },
              },
            },
          },
        })
      })

      addComponent({
        name: 'Icon',
        global: true,
        filePath: resolve('./runtime/Icon.vue'),
        priority: 10,
      })
      addComponent({
        name: 'IconSvg',
        global: true,
        filePath: resolve('./runtime/IconSvg.vue'),
      })
      addComponent({
        name: 'IconTw',
        global: true,
        filePath: resolve('./runtime/IconTw.vue'),
      })

      addPlugin(resolve('./runtime/nuxt-plugin'))

      nuxt.hook('devtools:customTabs', (iframeTabs) => {
        iframeTabs.push({
          name: 'icones',
          title: 'Icônes',
          icon: 'i-arcticons-iconeration',
          view: {
            type: 'iframe',
            src: 'https://icones.js.org',
          },
        })
      })
    },
  })

export default module

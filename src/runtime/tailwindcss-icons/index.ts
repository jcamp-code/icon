import plugin from 'tailwindcss/plugin.js'
import { getAllIconComponents } from './core'
import type { IconsPluginOptions } from './types'

export const iconsPlugin = (iconsPluginOptions?: IconsPluginOptions) => {
  const components = getAllIconComponents(iconsPluginOptions)

  return plugin(({ matchComponents }) => {
    for (const twPrefix of Object.keys(components)) {
      matchComponents(
        {
          [twPrefix]: (value) => {
            if (typeof value === 'string') return components[twPrefix][value]
            return value
          },
        },
        {
          values: components[twPrefix],
        }
      )
    }
  })
}

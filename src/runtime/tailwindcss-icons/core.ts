import path from 'path'
import fs from 'fs'
import type { IconifyIcon, IconifyJSON } from './iconifyTypes'
import { getIconCSS, getIconData } from '@iconify/utils'
import { createRequire } from 'module'
import { availableCollectionNames, type CollectionNames } from '../../types'
import type {
  GenerateOptions,
  IconCollection,
  IconsPluginOptions,
} from './types'

import type { IconifyJSONIconsData } from './iconifyTypes'
import { parseIconSet } from '@iconify/utils'
import { defu } from 'defu'

const req = createRequire(import.meta.url)

export const localResolve = (cwd: string, id: string) => {
  try {
    const resolved = req.resolve(id, { paths: [cwd] })
    return resolved
  } catch {
    return null
  }
}

function callerPath(): string | null {
  const error = new Error()
  const stack = error.stack?.split('\n') as string[]

  const data = stack.find(
    (line) =>
      !line.trim().startsWith('Error') &&
      !line.includes('(') &&
      !line.includes(')')
  )
  if (!data) {
    return null
  }

  const filePathPattern = new RegExp(
    // eslint-disable-next-line no-useless-escape
    /\s*at (\/.*|[a-zA-Z]:\\(?:([^<>:"\/\\|?*]*[^<>:"\/\\|?*.]\\|..\\)*([^<>:"\/\\|?*]*[^<>:"\/\\|?*.]\\?|..\\))?):\d+:\d+/i
  )
  const result = filePathPattern.exec(data)
  if (!result) {
    return null
  }

  return result[1]
}

export const isPackageExists = (id: string) => {
  const p = callerPath()
  const cwd = p ? path.dirname(p) : process.cwd()
  return Boolean(localResolve(cwd, id))
}

export const getIconCollections = (
  include: CollectionNames[] | 'all' = 'all'
): Record<string, IconifyJSON> => {
  const p = callerPath()
  const cwd = p ? path.dirname(p) : process.cwd()

  const pkgPath = localResolve(cwd, '@iconify/json/package.json')
  if (!pkgPath) {
    if (Array.isArray(include)) {
      return include.reduce((result, name) => {
        const jsonPath = localResolve(cwd, `@iconify-json/${name}/icons.json`)
        if (!jsonPath) {
          throw new Error(
            `Icon collection "${name}" not found. Please install @iconify-json/${name} or @iconify/json`
          )
        }
        return {
          ...result,
          [name]: req(jsonPath),
        }
      }, {})
    }
    if (include === 'all') {
      throw new Error(
        `All icon collections requested. Please install @iconify/json`
      )
    }
    return {}
  }
  const pkgDir = path.dirname(pkgPath)
  const files = fs.readdirSync(path.join(pkgDir, 'json'))
  const collections: Record<string, IconifyJSON> = {}
  for (const file of files) {
    if (
      include === 'all' ||
      include.includes(file.replace('.json', '') as any)
    ) {
      const json: IconifyJSON = req(path.join(pkgDir, 'json', file))
      collections[json.prefix] = json
    }
  }
  return collections
}

export const getAutoIconCollections = (
  collections?: IconCollection | CollectionNames[] | 'all'
) => {
  if (Array.isArray(collections)) {
    return getIconCollections(collections)
  }

  // an actual iconCollection passed here will stop all automatic loading, per original behavior
  if (typeof collections === 'object') return collections

  const names =
    collections === 'all'
      ? 'all'
      : availableCollectionNames.filter((name) =>
          isPackageExists(`@iconify-json/${name}`)
        )

  return getIconCollections(names)
}

export const getCustomCollections = (
  customCollections?: string | IconCollection | (IconCollection | string)[]
) => {
  if (typeof customCollections === 'string') {
    const json: IconifyJSON = req(customCollections)
    return {
      [json.prefix]: json,
    }
  }
  if (Array.isArray(customCollections)) {
    return customCollections.reduce((result, collection) => {
      if (typeof collection === 'string') {
        const json: IconifyJSON = req(collection)
        return {
          ...(result as IconCollection),
          [json.prefix]: json,
        }
      }
      return {
        ...(result as IconCollection),
        ...collection,
      }
    }, {})
  }

  return customCollections
}

export const generateIconComponent = (
  data: IconifyIcon,
  options: GenerateOptions
) => {
  const css = getIconCSS(data, {})
  const rules: Record<string, string> = {}
  css.replace(/^\s+([^:]+):\s*([^;]+);/gm, (_, prop, value) => {
    if (prop === 'width' || prop === 'height') {
      rules[prop] = `${options.scale}em`
    } else {
      rules[prop] = value
    }
    return ''
  })

  Object.assign(rules, { verticalAlign: 'middle' })

  if (options.extraProperties) {
    Object.assign(rules, options.extraProperties)
  }
  return rules
}

export const generateComponent = (
  {
    name,
    icons,
  }: {
    name: string
    icons: IconifyJSON
  },
  options: GenerateOptions
) => {
  const data = getIconData(icons, name)
  if (!data) return null
  return generateIconComponent(data, options)
}

export const getAllIconComponents = (
  iconsPluginOptions?: IconsPluginOptions
) => {
  const {
    collections: propsCollections,
    customCollections = {},
    scale = 1,
    prefix = 'i',
    extraProperties = {},
  } = iconsPluginOptions ?? {}

  const collections = defu(
    {} as IconCollection,
    getAutoIconCollections(propsCollections),
    getCustomCollections(customCollections)
  )

  const components: Record<string, Record<string, Record<string, string>>> = {}
  const collectionPrefixes = [] as string[]

  if (prefix) components[prefix] = {}

  for (const colPrefix of Object.keys(collections)) {
    collectionPrefixes.push(prefix ? `${prefix}-${colPrefix}` : `${colPrefix}`)
    const collection: IconifyJSONIconsData = {
      ...collections[colPrefix],
      prefix: colPrefix,
    }
    if (!prefix) components[colPrefix] = {}

    parseIconSet(collection, (name, data) => {
      if (!data || !name) return
      const key = prefix ? `${colPrefix}-${name}` : `${name}`
      components[prefix || colPrefix][key] = generateIconComponent(data, {
        scale,
        extraProperties,
      })
    })
  }

  return components
}

export const getAllPrefixes = (iconsPluginOptions?: IconsPluginOptions) => {
  const {
    collections: propsCollections,
    customCollections = {},
    prefix = 'i',
  } = iconsPluginOptions ?? {}

  const collections = defu(
    {} as IconCollection,
    getAutoIconCollections(propsCollections),
    getCustomCollections(customCollections)
  )

  const collectionPrefixes = [] as string[]

  for (const colPrefix of Object.keys(collections)) {
    collectionPrefixes.push(prefix ? `${prefix}-${colPrefix}` : `${colPrefix}`)
  }

  return collectionPrefixes
}

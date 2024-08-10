import type { CollectionNames } from '../../types'
import type { IconifyJSONIconsData } from './iconifyTypes'

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type GenerateOptions = {
  /**
   * Scale relative to the current font size (1em).
   *
   * @default 1
   */
  scale?: number
  /**
   * Extra CSS properties applied to the generated CSS.
   *
   * @default `{}`
   */
  extraProperties?: Record<string, string>
}

export type IconsOptions = {
  /**
   * Class prefix for matching icon rules.
   *
   * @default `i`
   */
  prefix?: string
} & GenerateOptions

export type IconCollection = Record<
  string,
  Optional<IconifyJSONIconsData, 'prefix'>
>

export type IconsPluginOptions = {
  /**
   * Provide any icon files or collections you want to add to the automatically resolved Iconify sets
   * Can be either single or array of:
   *   string: resolved paths to icon files
   *   IconCollection: icon collection object
   */
  customCollections?: string | IconCollection | (IconCollection | string)[]
  /**
   * Specify the Iconify sets you wish to include
   * Can be:
   *   IconCollection: entirely override the automation
   *   CollectionNames[]: specify the sets to include (ie ['mdi', 'ph])
   *   []: turn off automated resolution altogether
   *   'all': specifically opt in to loading the full Iconify JSON; warning: can be slow
   */
  collections?: IconCollection | CollectionNames[] | 'all'
  /**
   * Used to return all the resolved Iconify and custom prefixes
   */
  resolvedPrefixes?: string[]
} & IconsOptions

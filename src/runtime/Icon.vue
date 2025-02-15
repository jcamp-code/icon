<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'

const props = defineProps<{
  icon?: string
  name?: string
  tw?: boolean
}>()

const appConfig = useAppConfig() as unknown as {
  iconTw: {
    size?: string | number | false
    class?: string
    aliases?: Record<string, string>
    forceTailwind?: boolean
    resolvedPrefixes?: string[]
  }
}

const iconName = computed(() => {
  const name = props.icon || props.name || ''
  if (appConfig.iconTw?.aliases && appConfig.iconTw.aliases[name]) {
    return appConfig.iconTw.aliases[name]
  }

  return name
})

const useTwIcon = computed(() => {
  if (props.tw || appConfig.iconTw?.forceTailwind) return true

  // tailwind can't use : in classes
  if (iconName.value.includes(':')) return false

  // tailwind requires the json locally so check for loaded prefixes
  if (
    appConfig?.iconTw?.resolvedPrefixes?.find((element) => {
      return iconName.value.startsWith(element)
    })
  )
    return true

  return false
})
</script>

<template>
  <IconTw v-if="useTwIcon" :name="iconName" />
  <IconSvg v-else :name="iconName!">
    <template #default>
      <slot />
    </template>
  </IconSvg>
</template>

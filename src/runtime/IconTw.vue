<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'

const appConfig = useAppConfig() as unknown as {
  iconTw: {
    size?: string
    class?: string
    aliases?: Record<string, string>
  }
}

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '',
  },
})

const iconName = computed(() => {
  let result = props.name

  // aliases will only work if the app.config.ts file is scanned by tailwind
  if (appConfig.iconTw?.aliases && appConfig.iconTw.aliases[props.name]) {
    result = appConfig.iconTw.aliases[props.name]
  }

  return result
  // tempting as it is, cannot rewrite names because of tailwind scanning
  //  if (!result.startsWith('i-')) result = 'i-' + result

  //  return result.replace(/[/|:]/g, '-').replace(/[[|\]]/g, '')
})

const sSize = computed(() => {
  // Disable size if appConfig.iconTw.size === false
  if (
    !props.size &&
    typeof appConfig.iconTw?.size === 'boolean' &&
    !appConfig.iconTw?.size
  ) {
    return undefined
  }
  const size = props.size || appConfig.iconTw?.size || '1em'
  if (String(Number(size)) === size) {
    return `${size}px`
  }
  return size
})
</script>

<template>
  <span :class="iconName" :style="{ width: sSize, height: sSize }" />
</template>

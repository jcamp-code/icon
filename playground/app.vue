<template>
  <div>
    <p class="bg-blue-200">
      Tailwind:
      <IconTw name="mdi-abacus" />
      <IconTw name="mdi-abacus" size="2em" />
      <IconTw name="mdi-abacus" size="24" />
      <IconTw name="mdi-abacus" size="48" />
    </p>
    <p class="bg-blue-200">
      Spans:
      <span class="mdi-abacus" />
      <span class="mdi-access-point-minus" />
    </p>
    <p class="bg-blue-200">
      Automatic:
      <Icon name="mdi-abacus" />
      <Icon name="i-mdi-abacus" />
      <Icon name="mdi:abacus" />
      <Icon name="mdi-access-point-minus" size="24" />
      <Icon name="mdi-abjad-arabic" size="48" />
      <Icon name="i-logos-adobe-indesign" size="48" />
    </p>
    <p class="bg-green-200">
      DoubleDashes (breaks, not sure why):
      <Icon name="fa6-solid:arrow-up-1-9" />
      <Icon name="fa6-solid--arrow-up-1-9" />
    </p>
    <p class="bg-blue-200">
      Custom Icon JSON file:
      <Icon name="custom-icon1" />
    </p>
    <p>
      Sizes:
      <Icon name="uil:github" />
      <Icon name="uil:github" size="24" />
      <Icon name="uil:github" size="48" />
    </p>
    <p>
      Custom component:
      <Icon name="NuxtIcon" size="12" />
      <Icon name="NuxtIcon" size="24" />
      <Icon name="NuxtIcon" size="48" />
    </p>
    <p>
      Emoji:
      <Icon name="🚀" />
      <Icon name="🚀" size="24" />
      <Icon name="🚀" size="48" />
    </p>
    <p>
      Aliases:
      <Icon name="github" size="24" />
      <Icon name="nuxt" size="24" />
      <Icon name="rocket" size="24" />
    </p>
    <p>
      Failing:
      <Icon name="uil:bad"> ☀️ </Icon>
      <Icon name="uil:bad" />
      <Icon tw name="logos-adobe-indesign" size="48" class="border" /> (class
      not in loaded sets)
    </p>
  </div>
</template>

<style scoped>
p {
  display: flex;
  align-items: center;
  gap: 1em;
}
</style>

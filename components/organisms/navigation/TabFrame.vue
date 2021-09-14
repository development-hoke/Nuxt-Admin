<template>
  <div :class="className">
    <tab
      :items="items"
      :active-key="activeTabKey"
      @change-tab="({ key }) => (activeTabKey = key)"
    />
    <slot name="content" :activeTabKey="activeTabKey"></slot>
  </div>
</template>

<script>
import Tab from '@/components/molecules/navigation/Tab'

export const findInitialTabKey = (route, items, defaultKey = null) => {
  const { hash } = route

  if (!defaultKey) {
    defaultKey = items[0].key
  }

  if (!hash) {
    return defaultKey
  }

  const selectedTabKey = hash.substr(1)

  return items.some(({ key }) => key === selectedTabKey)
    ? selectedTabKey
    : defaultKey
}

export default {
  components: {
    Tab,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    className: {
      type: String,
      default: 'card',
    },
  },
  data() {
    return {
      activeTabKey: findInitialTabKey(this.$route, this.items),
    }
  },
}
</script>

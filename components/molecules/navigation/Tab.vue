<template>
  <nav class="nav-extended">
    <div class="nav-content">
      <ul class="tabs tabs-transparent">
        <li
          v-for="(item, index) in items"
          :key="item.key"
          class="tab col"
          :class="`s${isLastIndex(index) ? lastTabSize : tabSize}`"
        >
          <a
            :href="`#${item.key}`"
            :class="[isActive(item.key) ? 'active' : '']"
            @click="$emit('change-tab', item)"
            >{{ item.title }}</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
const CSS_COLUMN_SIZE = 12

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
  props: {
    items: {
      type: Array,
      required: true,
    },
    activeKey: {
      type: String,
      required: true,
    },
  },
  computed: {
    tabSize() {
      return Math.floor(CSS_COLUMN_SIZE / this.items.length)
    },
    lastTabSize() {
      return CSS_COLUMN_SIZE - this.tabSize * (this.items.length - 1)
    },
  },
  methods: {
    isActive(key) {
      return this.activeKey === key
    },
    isLastIndex(index) {
      return index === Math.max(this.items.length - 1, 0)
    },
  },
}
</script>

<style scoped>
nav {
  background-color: inherit;
  box-shadow: none;
}
nav.nav-extended {
  margin-bottom: 2rem;
}
.tabs.tabs-transparent .tab a,
.tabs.tabs-transparent .tab a:hover,
.tabs.tabs-transparent .tab.disabled a,
.tabs.tabs-transparent .tab.disabled a:hover {
  color: rgba(41, 182, 246, 0.7);
}
.tabs.tabs-transparent .tab a.active {
  color: #29b6f6;
  font-weight: bold;
}
</style>

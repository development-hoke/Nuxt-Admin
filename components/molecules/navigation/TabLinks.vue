<template>
  <nav class="nav-extended">
    <div class="nav-content">
      <ul class="tabs tabs-transparent">
        <li
          v-for="({ title, route }, index) in items"
          :key="index"
          class="tab col"
          :class="`s${isLastIndex(index) ? lastTabSize : tabSize}`"
        >
          <nuxt-link
            :class="[isActive(route.name) ? 'active' : '']"
            :to="route"
            >{{ title }}</nuxt-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
const CSS_COLUMN_SIZE = 12

export default {
  props: {
    items: {
      type: Array,
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
    isActive(name) {
      return name === this.$route.name
      // return this.activeKey === key
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

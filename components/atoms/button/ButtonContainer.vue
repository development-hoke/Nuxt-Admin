<template>
  <button
    class="btn"
    :class="[css, ...buttonClass.split(' ')]"
    :disabled="disabled"
    @click.prevent="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
import { typeCssMap } from '@/constants/variation'

export default {
  name: 'ButtonContainer',
  emits: ['click'],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    buttonClass: {
      type: String,
      default: 'waves-effect waves-light doc',
    },
    type: {
      type: String,
      default: 'primary',
      validator(value) {
        return Object.keys(typeCssMap).includes(value)
      },
    },
  },
  computed: {
    css() {
      return typeCssMap[this.type].css
    },
  },
  methods: {
    handleClick() {
      if (this.disabled) {
        return
      }

      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.btn:hover {
  opacity: 0.9;
}
</style>

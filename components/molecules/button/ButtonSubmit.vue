<template>
  <button
    type="submit"
    :class="[css, ...buttonClass.split(' ')]"
    :disabled="disabled"
    @click.prevent="onClick"
  >
    <Circular v-if="loading" />
    <slot v-else />
  </button>
</template>

<script>
import Circular from '@/components/atoms/preloader/Circular'
import { typeCssMap, PRIMARY } from '@/constants/variation'

export default {
  components: {
    Circular,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    buttonClass: {
      type: String,
      default: 'btn waves-effect waves-light doc',
    },
    color: {
      type: String,
      default: PRIMARY,
      validator(value) {
        return Object.keys(typeCssMap).includes(value)
      },
    },
  },
  computed: {
    loading() {
      return this.$store.state.common.loading
    },
    css() {
      return typeCssMap[this.color].css
    },
  },
  methods: {
    onClick() {
      if (this.loading) {
        return
      }

      this.$emit('onClick')
    },
  },
}
</script>

<style lang="scss">
.preloader-wrapper.small {
  width: 24px;
  height: 24px;
  margin-top: 6px;
}
</style>

<template>
  <vee-validation-observer v-slot="props" ref="observer" v-bind="$attrs">
    <slot v-bind="props"></slot>
  </vee-validation-observer>
</template>

<script>
import { ValidationObserver as VeeValidationObserver } from 'vee-validate'

export default {
  name: 'ValidationObserver',
  components: {
    VeeValidationObserver,
  },
  props: {
    externalErrors: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    externalErrors(errors) {
      this.setErrors(errors)
    },
  },
  mounted() {
    if (Object.keys(this.externalErrors).length > 0) {
      setTimeout(() => {
        this.setErrors(this.externalErrors)
      }, 500)
    }
  },
  methods: {
    setErrors(messages, retry = 0) {
      if (retry > 5) {
        return
      }

      if (!this.$refs.observer) {
        setTimeout(() => this.setErrors(messages, ++retry), 50)
        return
      }

      this.$refs.observer.setErrors(messages)
    },

    reset() {
      this.$refs.observer.reset()
    },
  },
}
</script>

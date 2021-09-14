<template>
  <textarea v-model="innerValue" />
</template>

<script>
export default {
  name: 'ArrayInputTextarea',
  props: {
    value: {
      type: [Array, String, Number],
      default: () => [],
    },
    delimiters: {
      type: [String, Array],
      default: () => [','],
    },
  },
  computed: {
    normalizedDelimiters() {
      return Array.isArray(this.delimiters)
        ? this.delimiters
        : [this.delimiters]
    },
    innerValue: {
      get() {
        return this.normalizedDelimiters.reduce(
          (value, delimiter) => {
            return value.join(delimiter)
          },
          [...(Array.isArray(this.value) ? this.value : [this.value])]
        )
      },
      set(value) {
        const processedValue = this.normalizedDelimiters.reduce(
          (value, delimiter) => {
            return value.split(delimiter)
          },
          value ?? ''
        )

        this.$emit('input', processedValue)
      },
    },
  },
}
</script>

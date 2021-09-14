<template>
  <validation-provider :tag="wrepperTag" :vid="computedVid">
    <input
      v-model="innerValue"
      :value="optionValue"
      :name="name"
      type="radio"
    />
    <slot></slot>
  </validation-provider>
</template>

<script>
export default {
  props: {
    optionValue: {
      type: [String, Number],
      required: true,
    },
    name: {
      type: [String, Number],
      default: null,
    },
    value: {
      type: [String, Number],
      default: null,
    },
    wrepperTag: {
      type: String,
      default: 'label',
    },
    vid: {
      type: [String, Number],
      default: null,
    },
  },
  computed: {
    computedVid() {
      return this.vid || this.name
    },
    innerValue: {
      set(value) {
        if (value !== this.value) {
          this.$emit('input', value)
        }
      },
      get() {
        return this.value
      },
    },
  },
}
</script>

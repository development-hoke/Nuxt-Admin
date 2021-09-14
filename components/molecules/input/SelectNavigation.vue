<template>
  <select v-model="selected" class="browser-default">
    <option
      v-for="(option, index) in options"
      :key="index"
      :value="option.code"
    >
      {{ option.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'SelectNavigation',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    defaultValue: {
      type: [String, Number, Boolean],
      default: null,
    },
    route: {
      type: Object,
      default: null,
    },
    paramName: {
      type: String,
      default: null,
    },
    onChange: {
      type: Function,
      default: null,
    },
  },
  computed: {
    innerOptions() {
      return this.options.map((option) =>
        option && typeof option === 'object'
          ? option
          : {
              name: option,
              code: option,
            }
      )
    },
    selected: {
      get() {
        return this.defaultValue
      },
      set(value) {
        if (typeof this.onChange === 'function') {
          this.onChange()
          return
        }

        const route = this.route ?? this.$route
        const { query } = route

        this.$router.push({
          ...route,
          query: { ...query, [this.paramName]: value },
        })
      },
    },
  },
}
</script>

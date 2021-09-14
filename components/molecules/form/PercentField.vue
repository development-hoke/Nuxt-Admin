<template>
  <text-field v-model="innerValue" type="number" :unit="unit" v-bind="$attrs" />
</template>

<script>
import TextField from '@/components/molecules/form/TextField'
import { multiply10NthPower } from '@/utils/math'

export default {
  name: 'PercentField',
  components: {
    TextField,
  },
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    unit: {
      type: String,
      default: '%',
    },
  },
  computed: {
    innerValue: {
      get() {
        if (!this.value) {
          return this.value
        }

        return multiply10NthPower(this.value, 2)
      },
      set(value) {
        this.$emit('input', multiply10NthPower(value, -2))
      },
    },
  },
}
</script>

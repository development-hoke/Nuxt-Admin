<template>
  <validation-provider
    v-slot="{ errors, validated }"
    ref="provider"
    :rules="rules"
    :name="validateName"
    :vid="computedVid"
    :class="wrapperClass"
    :tag="wrapperTag"
  >
    <label
      v-for="(option, index) in options"
      :key="index"
      class="doc check-box-list-filed"
      :class="inputFieldClass"
    >
      <input
        :name="`${name}.${index}`"
        type="checkbox"
        :class="getValidateCss(errors, validated)"
        :disabled="disabled"
        :checked="dict[option.code]"
        @input="($event) => handleInput($event, option.code)"
      />
      <span :class="labelClass">{{ option.name }}</span>
    </label>
    <error-message v-for="(error, key) in errors" :key="key">
      {{ error }}
    </error-message>
  </validation-provider>
</template>

<script>
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'
import { createDict } from '@/utils/dataStructure'

export default {
  name: 'CheckboxList',
  components: {
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    dict() {
      return createDict(this.value)
    },
  },
  methods: {
    handleInput(event, code) {
      const selectedValues = [...this.value]

      const index = selectedValues.indexOf(code)

      if (event.target.checked) {
        if (index === -1) {
          selectedValues.push(code)
        }
      } else if (index > -1) {
        selectedValues.splice(index, 1)
      }

      this.$emit('input', selectedValues)
    },
  },
}
</script>

<style lang="scss" scoped>
.check-box-list-filed {
  margin-left: 15px;

  &:first-child {
    margin-left: 0;
  }
}
</style>

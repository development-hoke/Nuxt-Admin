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
    <div :class="inputFieldClass">
      <label v-if="label" :for="id">{{ label }}</label>
      <select
        :id="id"
        v-model="innerValue"
        :class="[inputClass, getValidateCss(errors, validated)].join(' ')"
        :disabled="disabled"
      >
        <option
          v-if="useUnselectOption"
          :value="unselectOption.code"
          :disabled="!allowSelectUnselectOption && hasRule('required')"
          >{{ unselectOption.name }}</option
        >
        <option
          v-for="option in options"
          :key="option.code"
          :value="option.code"
          :disabled="option.disabled || false"
          >{{ option.name }}</option
        >
      </select>
      <error-message v-for="(error, key) in errors" :key="key">
        {{ error }}
      </error-message>
    </div>
  </validation-provider>
</template>

<script>
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'

export default {
  components: {
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    inputClass: {
      type: String,
      default: 'browser-default',
    },
    unselectOption: {
      type: Object,
      default: () => ({ name: '選択してください', code: null }),
    },
    useUnselectOption: {
      type: Boolean,
      default: true,
    },
    allowSelectUnselectOption: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

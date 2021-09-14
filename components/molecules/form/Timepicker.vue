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
      <Timepicker
        :id="id"
        v-model="innerValue"
        :class-name="[inputClass, getValidateCss(errors, validated)].join(' ')"
        :clear-button="!clearButton"
        :disabled="disabled"
        format="HH:mm"
        advanced-keyboard
        placeholder="時刻を選択してください"
      ></Timepicker>
      <error-message v-for="(error, key) in errors" :key="key">
        {{ error }}
      </error-message>
    </div>
  </validation-provider>
</template>

<script>
import Timepicker from '@/components/atoms/input/Timepicker'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'

export default {
  components: {
    Timepicker,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    value: {
      type: String,
      default: null,
    },
    clearButton: {
      type: Boolean,
      default: true,
    },
    inputFieldClass: {
      type: String,
      default: 'input-field inline',
    },
    wrapperTag: {
      type: String,
      default: 'span',
    },
  },
}
</script>

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
    <div
      :class="[
        'datepicker-wrapper',
        clearButton ? 'show-clear-button' : '',
        getValidateCss(errors, validated),
        ...inputFieldClass.split(' '),
      ]"
    >
      <label v-if="label" :for="id">{{ label }}</label>
      <datepicker
        :id="id"
        v-model="innerValue"
        :class-name="inputClass"
        format="yyyy/M/d"
        :monday-first="true"
        :clear-button="clearButton"
        :disabled="disabled"
        placeholder="日付を選択してください"
      ></datepicker>
      <error-message v-for="(error, key) in errors" :key="key">
        {{ error }}
      </error-message>
    </div>
  </validation-provider>
</template>

<script>
import Datepicker from '@/components/atoms/input/Datepicker'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'

export default {
  components: {
    Datepicker,
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
  methods: {
    setValidateClass(errors, validated) {
      if (!validated) return ''
      return errors.length ? 'validate invalid' : 'validate valid'
    },
  },
}
</script>

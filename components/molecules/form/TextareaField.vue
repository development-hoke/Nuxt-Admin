<template>
  <validation-provider
    v-slot="{ errors, validated, failedRules }"
    ref="provider"
    :rules="rules"
    :name="validateName"
    :vid="computedVid"
    :class="wrapperClass"
    :tag="wrapperTag"
  >
    <input-field :input-field-class="inputFieldClass">
      <textarea
        :id="id"
        v-model="innerValue"
        class="validate materialize-textarea"
        :class="
          ([inputClass, getValidateCss(errors, validated)].join(' '),
          disabled ? 'disabled' : '')
        "
        :disabled="disabled"
        @focus="$emit('focus')"
      ></textarea>
      <label
        v-if="label"
        :for="id"
        :class="[labelClass, innerValue ? 'active' : '']"
        >{{ label }}</label
      >
      <error-message
        v-for="(message, key) in combineErrors(errors, failedRules)"
        :key="key"
        >{{ message }}</error-message
      >
    </input-field>
  </validation-provider>
</template>

<script>
import InputField from '@/components/molecules/form/InputField'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'

export default {
  name: 'TextareaField',
  components: {
    InputField,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },
}
</script>

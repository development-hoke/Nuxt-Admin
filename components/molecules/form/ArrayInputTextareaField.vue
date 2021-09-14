<template>
  <validation-provider
    v-slot="{ errors, validated }"
    ref="provider"
    :rules="rules"
    :name="validName"
    :vid="computedVid"
    :class="wrapperClass"
    :tag="wrapperTag"
  >
    <input-field
      :class="[inputFieldClass, getValidateCss(errors, validated)].join(' ')"
    >
      <label v-if="label" :class="labelClass">{{ label }}</label>
      <array-input-textarea
        :id="id"
        v-model="innerValue"
        :disabled="disabled"
        :name="name"
        :class="inputClass"
      />
      <error-message v-for="(error, key) in errors" :key="key">{{
        error
      }}</error-message>
    </input-field>
  </validation-provider>
</template>

<script>
import InputField from '@/components/molecules/form/InputField'
import ArrayInputTextarea from '@/components/atoms/input/ArrayInputTextarea'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'

export default {
  name: 'ArrayInputTextareaField',
  components: {
    InputField,
    ArrayInputTextarea,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    value: {
      type: [Array, String, Number],
      default: () => [],
    },
    inputClass: {
      type: String,
      default: 'materialize-textarea',
    },
  },
}
</script>

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
    <input-field
      :input-field-class="[inputFieldClass, unit ? 'use-unit' : ''].join(' ')"
    >
      <i v-if="icon" class="material-icons prefix pt-2">{{ icon }}</i>
      <input
        :id="id"
        v-model="innerValue"
        :type="type"
        class="validate"
        :class="
          ([inputClass, getValidateCss(errors, validated)].join(' '),
          disabled ? 'disabled' : '')
        "
        :disabled="disabled"
        @focus="$emit('focus')"
      />
      <label
        v-if="label"
        :for="id"
        :class="[labelClass, innerValue ? 'active' : '']"
        >{{ label }}</label
      >
      <span v-if="unit" class="input-field-unit">{{ unit }}</span>
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
  components: {
    InputField,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    unit: {
      type: String,
      default: null,
    },
  },
}
</script>

<style scoped>
.use-unit {
  position: relative;
}
.input-field-unit {
  position: absolute;
  top: 14px;
  right: -18px;
}
</style>

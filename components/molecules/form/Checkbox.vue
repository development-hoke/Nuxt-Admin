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
    <label class="doc" :class="inputFieldClass">
      <input
        v-model="innerValue"
        type="checkbox"
        :class="getValidateCss(errors, validated)"
        :disabled="disabled"
      />
      <span :class="labelClass">{{ label }}</span>
    </label>
    <error-message v-for="(error, key) in errors" :key="key">
      {{ error }}
    </error-message>
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
      type: [Boolean, Number],
      default: false,
    },
  },
}
</script>

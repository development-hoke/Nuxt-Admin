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
      <editor
        v-model="innerValue"
        class="validate"
        :class="[inputClass, getValidateCss(errors, validated)].join(' ')"
      />
      <error-message v-for="(error, key) in errors" :key="key">
        {{ error }}
      </error-message>
    </div>
  </validation-provider>
</template>

<script>
import Editor from '@/components/atoms/input/Editor'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'

export default {
  components: {
    Editor,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => ({
        language: 'ja',
      }),
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

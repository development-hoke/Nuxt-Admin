<template>
  <validation-provider
    v-slot="{ errors, validated, failedRules }"
    ref="provider"
    :rules="rules"
    :name="validName"
    :vid="computedVid"
    :class="wrapperClass"
    :tag="wrapperTag"
  >
    <label v-if="label" :class="labelClass">{{ label }}</label>
    <multiselect
      v-model="innerValue"
      placeholder="選択してください"
      select-label=""
      selected-label="選択済"
      deselect-label="解除"
      no-options="入力してください"
      tag-placeholder=""
      label="name"
      track-by="code"
      :options="options"
      :multiple="true"
      :taggable="true"
      :show-no-options="false"
      :disabled="disabled"
      :class="[inputClass.split(' '), getValidateCss(errors, validated)]"
    >
    </multiselect>
    <error-message
      v-for="(message, key) in combineErrors(errors, failedRules)"
      :key="key"
      >{{ message }}</error-message
    >
  </validation-provider>
</template>

<script>
import Multiselect from 'vue-multiselect'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'

export default {
  components: {
    Multiselect,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [Array, String, Number, Boolean],
      default: () => [],
    },
  },
  computed: {
    innerValue: {
      set(value) {
        this.$emit(
          'input',
          value.map(({ code }) => code)
        )
      },
      get() {
        return (Array.isArray(this.value) ? this.value : [this.value])
          .filter((code) => this.optionDict[code])
          .map((code) => this.optionDict[code])
      },
    },
    optionDict() {
      const optionDict = this.options.reduce(
        (dict, option) => ({
          ...dict,
          [option.code]: option,
        }),
        {}
      )
      return optionDict
    },
  },
}
</script>

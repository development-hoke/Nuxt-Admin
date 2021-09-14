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
    <label v-if="label" :class="labelClass">{{ label }}</label>
    <div>
      <template v-for="(option, index) in options">
        <label :key="index" :class="direction">
          <input
            :id="id"
            v-model="innerValue"
            :value="option.code"
            :disabled="disabled"
            :name="name"
            type="radio"
            :class="[inputClass.split(' '), getValidateCss(errors, validated)]"
          />
          <span>{{ option.name }}</span>
        </label>
      </template>
    </div>
    <error-message v-for="(error, key) in errors" :key="key">{{
      error
    }}</error-message>
  </validation-provider>
</template>

<script>
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'

export default {
  name: 'RadioBox',
  components: {
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    direction: {
      type: String,
      default: 'horizontal',
    },
  },
  computed: {
    innerValue: {
      set(value) {
        if (value !== this.value) {
          this.$emit('input', value)
        }
      },
      get() {
        if (typeof this.value === 'boolean') return Number(this.value)
        return this.value
      },
    },
  },
}
</script>

<style scoped>
label.vertical {
  display: block;
}
</style>

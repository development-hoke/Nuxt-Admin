<template>
  <ValidationProvider
    v-slot="{ errors, failedRules }"
    ref="provider"
    :rules="rules"
    :name="validateName"
    :vid="computedVid"
    :class="wrapperClass"
    :tag="wrapperTag"
  >
    <label v-if="label" :class="labelClass">{{ label }}</label>
    <SearchableSelect
      :id="id"
      v-model="innerValue"
      :name="name"
      :options="options"
      :filterable="filterable"
      :searchable="true"
      :multiple="multiple"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :clearable="clearable"
      :class="inputClass"
      @search="handleSearch"
    />
    <error-message
      v-for="(message, key) in combineErrors(errors, failedRules)"
      :key="key"
      >{{ message }}</error-message
    >
  </ValidationProvider>
</template>

<script>
import SearchableSelect from '@/components/molecules/input/SearchableSelect'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'

export default {
  name: 'SearchableSelectField',
  components: {
    SearchableSelect,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    transition: {
      type: String,
      default: 'fade',
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleSearch(search, loading) {
      this.$emit('search', search, loading)
    },
  },
}
</script>

<template>
  <VueSelect
    v-model="innerValue"
    :name="name"
    :options="innerOptions"
    :filterable="filterable"
    :searchable="true"
    :multiple="multiple"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :clearable="clearable"
    @search="handleSearch"
  >
    <template slot="no-options">
      <slot name="no-options">キーワードを入力してください。</slot>
    </template>
  </VueSelect>
</template>

<script>
import VueSelect from 'vue-select'

export default {
  name: 'SearchableSelect',
  components: {
    VueSelect,
  },
  props: {
    name: {
      type: String,
      default: null,
    },
    value: {
      type: [String, Number, Array],
      default: () => [],
    },
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
  computed: {
    innerValue: {
      get() {
        return this.value.map(({ code, name }) => ({
          value: code,
          label: name,
        }))
      },
      set(value) {
        if (!this.multiple) {
          this.$emit('input', value)
          return
        }
        this.$emit(
          'input',
          value.map(({ value, label }) => ({ code: value, name: label }))
        )
      },
    },
    innerOptions() {
      return this.options.map(({ code, name }) => ({
        value: code,
        label: name,
      }))
    },
  },
  methods: {
    handleSearch(search, loading) {
      this.$emit('search', search, loading)
    },
  },
}
</script>

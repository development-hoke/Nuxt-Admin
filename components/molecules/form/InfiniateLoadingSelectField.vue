<template>
  <validation-provider
    v-slot="{ errors, failedRules, validated }"
    ref="provider"
    class="validation-provider"
    :rules="rules"
    :name="validateName"
    :vid="computedVid"
    :class="wrapperClass"
    :tag="wrapperTag"
  >
    <div class="loading-input-field" :input-field-class="inputFieldClass">
      <InfiniateLoadingSelect
        ref="infiniateLoadingSelect"
        v-model="innerValue"
        :options="options"
        :class="[inputClass, getValidateCss(errors, validated)].join(' ')"
        @reached-end="($state) => $emit('reached-end', $state)"
      />
      <error-message
        v-for="(message, key) in combineErrors(errors, failedRules)"
        :key="key"
        >{{ message }}</error-message
      >
    </div>
  </validation-provider>
</template>

<script>
import InfiniateLoadingSelect from '@/components/molecules/input/InfiniateLoadingSelect'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'

export default {
  name: 'InfiniateLoadingSelectField',
  emits: ['reached-end'],
  components: {
    InfiniateLoadingSelect,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [Number, String, Boolean],
      default: null,
    },
  },
  methods: {
    resetLoadingState() {
      this.$refs.infiniateLoadingSelect.resetLoadingState()
    },
  },
}
</script>

<style lang="scss" scoped>
.validation-provider {
  height: 100%;
}
.loading-input-field {
  height: 100%;
}
</style>

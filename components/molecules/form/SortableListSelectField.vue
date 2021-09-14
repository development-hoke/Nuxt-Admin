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
    <div :class="[inputFieldClass]">
      <SortableListSelect
        :id="id"
        v-model="innerValue"
        :options="options"
        :display-name="displayName"
        class="validate"
        :class="[inputClass, getValidateCss(errors, validated)].join(' ')"
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
import SortableListSelect from '@/components/molecules/input/SortableListSelect'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'

export default {
  name: 'SortableListSelectField',
  components: {
    SortableListSelect,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
    displayName: {
      type: String,
      default: null,
    },
  },
}
</script>

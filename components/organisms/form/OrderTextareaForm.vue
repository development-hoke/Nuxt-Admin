<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    tag="div"
    :external-errors="serverErrors"
  >
    <div class="row">
      <div class="col s8">
        <TextareaField
          v-model="innerValue"
          input-field-class="input-field mt-0"
          rules="max:10000"
        />
      </div>
      <div class="col s4">
        <ButtonContainer
          :disabled="disabledSubmit"
          @click="handleSubmit(submitHander)"
          >更新</ButtonContainer
        >
      </div>
    </div>
    <div v-if="serverErrors.global" class="row">
      <div class="col s12">
        <SmallErrorMessageList :messages="serverErrors.global" />
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import TextareaField from '@/components/molecules/form/TextareaField'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'

export default {
  name: 'OrderTextareaForm',
  components: {
    TextareaField,
    ButtonContainer,
    SmallErrorMessageList,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    submitHander: {
      type: Function,
      required: true,
    },
    serverErrors: {
      type: Object,
      default: () => ({}),
    },
    disabledSubmit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    innerValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

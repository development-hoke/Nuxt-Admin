<template>
  <div>
    <ButtonContainer :disabled="disabled" @click="handleClickButton"
      ><slot name="button">一括登録</slot></ButtonContainer
    >
    <span>CSV(カンマ区切り)ファイルを選択してください。</span>
    <FileInput
      v-if="openDialog"
      :encoding="encoding"
      @input="(data) => $emit('input', data)"
      @close="openDialog = false"
    />
  </div>
</template>

<script>
import FileInput, {
  ENCODEING_TYPE_BASE64,
  ENCODEING_TYPE_NONE,
} from '@/components/atoms/input/FileInput'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'

export { ENCODEING_TYPE_BASE64, ENCODEING_TYPE_NONE }

export default {
  name: 'FileInputGroup',
  components: {
    FileInput,
    ButtonContainer,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    encoding: {
      type: String,
      default: ENCODEING_TYPE_BASE64,
      validate(value) {
        return [ENCODEING_TYPE_NONE, ENCODEING_TYPE_BASE64].includes(value)
      },
    },
  },
  data() {
    return {
      openDialog: false,
    }
  },
  methods: {
    handleClickButton() {
      if (this.disabled) {
        return
      }

      this.openDialog = true
    },
  },
}
</script>

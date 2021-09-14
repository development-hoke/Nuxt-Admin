<template>
  <input v-show="show" ref="input" type="file" @change="handleChange" />
</template>

<script>
export const ENCODEING_TYPE_NONE = 'none'
export const ENCODEING_TYPE_BASE64 = 'base64'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    show: {
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
      handleCancel: null,
    }
  },

  mounted() {
    this.initializeInput()

    this.handleCancel = () => {
      window.removeEventListener('focus', this.handleCancel)
      setTimeout(() => this.$emit('close'), 200)
    }

    window.addEventListener('focus', this.handleCancel)
  },

  methods: {
    initializeInput(retry = 0) {
      if (retry > 5) {
        return
      }

      if (!this.$refs.input) {
        setTimeout(() => this.initializeInput(++retry), 50)
        return
      }

      this.$refs.input.click()
    },

    handleChange(event) {
      if (!event.target.files || event.target.files.length === 0) {
        this.$emit('close')
        return
      }

      const file = event.target.files[0]

      switch (this.encoding) {
        case ENCODEING_TYPE_BASE64:
          this.handleInputWithBase64(file)
          break

        case ENCODEING_TYPE_NONE:
        default:
          this.$emit('input', file)
          break
      }
    },

    handleInputWithBase64(file) {
      const fileReader = new FileReader()

      fileReader.onload = (event) => {
        this.$emit('input', {
          base64: event.target.result,
          name: file.name,
          contentType: file.type,
        })
        this.$emit('close')
      }

      fileReader.readAsDataURL(file)
    },
  },
}
</script>

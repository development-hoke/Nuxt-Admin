<template>
  <alert-modal ref="container" :type="type" @close="handleClose">
    <template #title="props">
      <slot name="title" v-bind="props"></slot>
    </template>
    <template #body>
      <div v-if="message">{{ message }}</div>
    </template>
    <template #control="{ css }">
      <a href="" :class="`${css}-text`" @click.prevent="handleOk">OK</a>
      <a href="" :class="`${css}-text`" @click.prevent="handleCancel"
        >キャンセル</a
      >
    </template>
  </alert-modal>
</template>

<script>
import AlertModal, { typeCssMap } from '@/components/organisms/modal/AlertModal'

export default {
  name: 'ConfirmModal',
  emits: ['ok', 'cancel'],
  components: {
    AlertModal,
  },
  props: {
    type: {
      type: String,
      default: 'info',
      validator(value) {
        return Object.keys(typeCssMap).includes(value)
      },
    },
  },
  data() {
    return {
      message: null,
    }
  },
  methods: {
    handleOk() {
      this.$emit('ok')
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleClose() {
      this.$emit('cancel')
    },
    open(params = {}) {
      const { message = null } = params
      this.message = message
      this.$refs.container.open()
    },
    close() {
      this.message = null
      this.$refs.container.close()
    },
  },
}
</script>

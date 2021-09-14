<template>
  <alert-modal ref="container" :type="type" @close="handleClose">
    <template #title="props">
      <slot name="title" v-bind="props"></slot>
    </template>
    <template #body="props">
      <slot name="body" v-bind="props"></slot>
    </template>
    <template #control="{ css }">
      <a href="" :class="`${css}-text`" @click.prevent="handleClose">閉じる</a>
    </template>
  </alert-modal>
</template>

<script>
import AlertModal, { typeCssMap } from '@/components/organisms/modal/AlertModal'

export default {
  name: 'NoticeModal',
  emits: ['close'],
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
  methods: {
    handleClose() {
      this.$refs.container.close()
    },
    open() {
      this.$refs.container.open()
    },
    close() {
      this.$refs.container.close()
    },
  },
}
</script>

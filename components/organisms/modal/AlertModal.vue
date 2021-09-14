<template>
  <modal-container ref="container">
    <div class="card-alert card lighten-5" :class="css">
      <div class="card-content darken-1" :class="`${css}-text`">
        <span class="card-title darken-1" :class="`${headerTextCss}-text`"
          ><slot name="title" :css="css"></slot
        ></span>
        <slot name="body" :css="css"></slot>
      </div>
      <div class="card-action lighten-4" :class="css">
        <slot name="control" :css="css"></slot>
      </div>
      <button
        type="button"
        class="close"
        :class="`${css}-text`"
        @click="$emit('close')"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  </modal-container>
</template>

<script>
import modalMixin from '@/components/organisms/modal/mixins/modalMixin'
import ModalContainer from '@/components/molecules/modal/ModalContainer'

export const typeCssMap = {
  danger: {
    css: 'red',
    headerTextCss: 'red',
  },
  warn: {
    css: 'orange',
    headerTextCss: 'pink',
  },
  info: {
    css: 'cyan',
    headerTextCss: 'cyan',
  },
}

export default {
  name: 'AlertModalContainer',
  emits: ['opened', 'closed', 'close'],
  components: {
    ModalContainer,
  },
  mixins: [modalMixin],
  props: {
    type: {
      type: String,
      default: 'info',
      validator(value) {
        return Object.keys(typeCssMap).includes(value)
      },
    },
  },
  computed: {
    css() {
      return typeCssMap[this.type].css
    },
    headerTextCss() {
      return typeCssMap[this.type].headerTextCss
    },
  },
}
</script>

<style scoped lang="scss">
.card-alert {
  z-index: 1;
  width: 33%;
  left: 0;
  right: 0;
  margin: auto;
}
</style>

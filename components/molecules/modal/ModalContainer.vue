<template>
  <transition name="fade">
    <div v-if="show" class="modal-background">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export const EVENT_TYPE_OPENED = 'opened'
export const EVENT_TYPE_CLOSED = 'closed'

export default {
  name: 'ModalContainer',
  emits: [EVENT_TYPE_OPENED, EVENT_TYPE_CLOSED],
  data() {
    return {
      show: false,
    }
  },
  methods: {
    open() {
      this.show = true
      this.$emit(EVENT_TYPE_OPENED)
    },
    close() {
      this.show = false
      this.$emit(EVENT_TYPE_CLOSED)
    },
    toggle() {
      this.show = !this.show
      this.$emit(this.show ? EVENT_TYPE_OPENED : EVENT_TYPE_CLOSED)
    },
  },
}
</script>

<style scoped lang="scss">
.modal-background {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
}
</style>

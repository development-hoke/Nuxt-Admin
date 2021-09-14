/**
 * ModalContainerを使用するための共通インターフェース
 */
export default {
  methods: {
    open() {
      this.$refs.container.open()
    },
    close() {
      this.$refs.container.close()
    },
    toggle() {
      this.$refs.container.toggle()
    },
    handleModalOpened() {
      this.$emit('opened')
    },
    handleModalClosed() {
      this.$emit('closed')
    },
  },
  mounted() {
    const checkContainer = (retry = 0) => {
      if (retry > 5) {
        throw new Error('modalMixin.js: $refs.containerが参照できません。')
      }

      if (!this.$refs.container) {
        setTimeout(() => checkContainer(++retry), 100)
      }
    }

    this.$nextTick(() => checkContainer())
  },
}

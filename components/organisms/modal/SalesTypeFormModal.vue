<template>
  <modal-container ref="container">
    <sales-type-form
      class="modal"
      role="dialog"
      :sales-type="salesType"
      :mode="mode"
      @cancel="close"
      @saved="close"
    />
  </modal-container>
</template>

<script>
import ModalContainer from '@/components/molecules/modal/ModalContainer'
import SalesTypeForm from '@/components/organisms/form/SalesTypeForm'
import modalMixin from '@/components/organisms/modal/mixins/modalMixin'

export default {
  name: 'SalesTypeFormModal',
  emits: ['opened', 'closed'],
  components: {
    SalesTypeForm,
    ModalContainer,
  },
  mixins: [modalMixin],
  data() {
    return {
      mode: null,
      salesType: {},
    }
  },
  methods: {
    open(mode, item) {
      this.mode = mode
      this.salesType = item
      this.$refs.container.open()
    },

    handleModalClose() {
      this.$emit('closed')
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  background: #fff;
  box-shadow: 2px 2px 20px 1px;
  overflow: visible;
  display: flex;
  flex-direction: column;
}
</style>

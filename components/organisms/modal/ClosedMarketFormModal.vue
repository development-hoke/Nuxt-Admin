<template>
  <ModalContainer ref="container">
    <ClosedMarketForm
      class="modal"
      :item-id="itemId"
      :default-inputs="defaultInputs"
      :item-details="itemDetails"
      :closed-market-id="closedMarketId"
      @cancel="close"
      @saved="close"
    />
  </ModalContainer>
</template>

<script>
import ModalContainer from '@/components/molecules/modal/ModalContainer'
import ClosedMarketForm from '@/components/organisms/form/ClosedMarketForm'
import modalMixin from '@/components/organisms/modal/mixins/modalMixin'

export default {
  name: 'ClosedMarketFormModal',
  emits: ['opened', 'closed'],
  components: {
    ClosedMarketForm,
    ModalContainer,
  },
  mixins: [modalMixin],
  data() {
    return {
      itemId: null,
      defaultInputs: {},
      itemDetails: [],
      closedMarketId: null,
    }
  },
  methods: {
    open({ itemId, itemDetails, defaultInputs = {} }) {
      this.itemId = itemId
      this.defaultInputs = defaultInputs
      this.itemDetails = itemDetails
      this.closedMarketId = defaultInputs.id || null
      this.$refs.container.open()
    },

    handleModalClose() {
      this.itemId = null
      this.defaultInputs = {}
      this.itemDetails = []
      this.$emit('closed')
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  background: #fff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 44%;
  max-height: 100%;
}
</style>

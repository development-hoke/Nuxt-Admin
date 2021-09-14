<template>
  <modal-container ref="container">
    <online-category-form
      class="modal"
      role="dialog"
      :mode="mode"
      :parent="parent"
      :default-inputs="defaultInputs"
      @cancel="close"
      @saved="close"
    />
  </modal-container>
</template>

<script>
import ModalContainer from '@/components/molecules/modal/ModalContainer'
import OnlineCategoryForm from '@/components/organisms/form/OnlineCategoryForm'
import modalMixin from '@/components/organisms/modal/mixins/modalMixin'

export default {
  name: 'OnlineCategoryFormModal',
  emits: ['opened', 'closed'],
  components: {
    OnlineCategoryForm,
    ModalContainer,
  },
  mixins: [modalMixin],
  data() {
    return {
      parent: null,
      mode: null,
      defaultInputs: null,
    }
  },
  methods: {
    open(mode, parent = null, defaultInputs = null) {
      this.mode = mode
      this.parent = parent
      this.defaultInputs = defaultInputs
      this.$refs.container.open()
    },

    handleModalClose() {
      this.parent = null
      this.defaultInputs = null
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
}
</style>

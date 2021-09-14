<template>
  <modal-container ref="container">
    <div class="card lighten-4 padding-4">
      <TreeViewSelectInput
        v-model="value"
        class="row"
        :tree="tree"
        :dict="dict"
        :title="title"
      />
      <div class="row">
        <div class="col s12 right-align">
          <button-container type="secondary" @click="handleClickCancel"
            >キャンセル</button-container
          >
          <button-container type="primary" @click="handleClickEnter"
            >確定</button-container
          >
        </div>
      </div>
    </div>
  </modal-container>
</template>

<script>
import modalMixin from '@/components/organisms/modal/mixins/modalMixin'
import ModalContainer from '@/components/molecules/modal/ModalContainer'
import TreeViewSelectInput from '@/components/organisms/input/TreeViewSelectInput'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'

export default {
  name: 'TreeViewSelectInputModal',
  emits: ['opened', 'closed', 'enter'],
  components: {
    ModalContainer,
    TreeViewSelectInput,
    ButtonContainer,
  },
  mixins: [modalMixin],
  props: {
    tree: {
      type: Array,
      required: true,
    },
    dict: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: [],
      title: null,
    }
  },
  methods: {
    open(params) {
      const { value = [], title = null } = params
      this.value = value
      this.title = title
      this.$refs.container.open()
    },
    handleClickEnter() {
      this.$emit('enter', this.value)
      this.close()
    },
    handleClickCancel() {
      this.close()
    },
  },
}
</script>

<style scoped lang="scss">
.card {
  max-height: 100vh;
}
body {
  position: fixed;
  overflow-y: hidden;
}
</style>

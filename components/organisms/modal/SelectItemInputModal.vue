<template>
  <ModalContainer ref="container">
    <SelectItemInput
      :exclueds="exclueds"
      :title="title"
      @select="(value) => $emit('select', value)"
      @cancel="close"
    />
  </ModalContainer>
</template>

<script>
import modalMixin from '@/components/organisms/modal/mixins/modalMixin'
import ModalContainer from '@/components/molecules/modal/ModalContainer'
import SelectItemInput from '@/components/organisms/input/SelectItemInput'

export default {
  name: 'SelectItemInputModal',
  emits: ['opened', 'closed', 'select'],
  components: {
    ModalContainer,
    SelectItemInput,
  },
  mixins: [modalMixin],
  data() {
    return {
      exclueds: [],
      title: null,
    }
  },
  methods: {
    open(params) {
      const { exclueds = [], title = '' } = params
      this.exclueds = exclueds
      this.title = title
      this.$refs.container.open()
    },
  },
}
</script>

<template>
  <modal-container ref="container">
    <div class="modal">
      <div class="modal-body">
        <div class="right-align mt-1 mb-1">
          <CancelButton @click="handleCancel" />
        </div>
        <TopContentMainVisualSortAddTable
          ref="topContentMainVisualSortAddTable"
        />
      </div>
      <footer class="modal-footer center-align">
        <ErrorMessage v-if="error" class="center-align">{{
          error
        }}</ErrorMessage>
        <ButtonContainer @click="handleAdd">追加</ButtonContainer>
      </footer>
    </div>
  </modal-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ModalContainer from '@/components/molecules/modal/ModalContainer'
import TopContentMainVisualSortAddTable from '@/components/organisms/table/TopContentMainVisualSortAddTable'
import CancelButton from '@/components/atoms/button/CancelButton'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import modalMixin from '@/components/organisms/modal/mixins/modalMixin'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'

export default {
  name: 'TopContentMainVisualAddModal',
  emits: ['opened', 'closed'],
  components: {
    TopContentMainVisualSortAddTable,
    ModalContainer,
    CancelButton,
    ButtonContainer,
    ErrorMessage,
  },
  mixins: [modalMixin],
  data() {
    return {
      error: '',
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/data',
      enumOption: 'enum/options',
    }),
  },
  methods: {
    open(params = {}) {
      this.$refs.container.open()
    },
    handleCancel() {
      this.close()
    },
    handleAdd() {
      const params = this.$refs.topContentMainVisualSortAddTable.getInputs()

      // eslint-disable-next-line
      const regex = /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g

      if (params.spPath === null) {
        this.error = 'SP用バナーは必須です。'
        return
      } else if (params.pcPath === null) {
        this.error = 'PC用バナーは必須です。'
        return
      } else if (params.url === '') {
        this.error = 'URLは必須です。'
        return
      } else if (params.url.match(regex) === null) {
        this.error = 'URLの形式が正しくありません'
        return
      }

      this.$emit('add', { ...params })
      this.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  background: #fff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  height: 80%;
  max-height: 80%;
  padding: 0 0 86px 0;
  position: relative;

  .modal-body {
    height: 84%;
  }

  .modal-footer {
    position: absolute;
    bottom: 0;
    height: unset;

    button {
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      display: block;
    }
  }
}
</style>

<template>
  <modal-container ref="container">
    <ItemSortAddSearchForm @search="handleSearch" />
    <div class="modal">
      <div class="modal-body">
        <div class="right-align mt-1 mb-1">
          <CancelButton @click="handleCancel" />
        </div>
        <ItemSortAddTable
          ref="itemSortAddTable"
          :items="filteredItems"
          @reached-end="handleReachedEnd"
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
import EventEmitter from 'events'
import { mapGetters } from 'vuex'
import ModalContainer from '@/components/molecules/modal/ModalContainer'
import ItemSortAddTable from '@/components/organisms/table/ItemSortAddTable'
import ItemSortAddSearchForm from '@/components/organisms/form/ItemSortAddSearchForm'
import CancelButton from '@/components/atoms/button/CancelButton'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import modalMixin from '@/components/organisms/modal/mixins/modalMixin'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'

export default {
  name: 'PlanItemAddModal',
  emits: ['opened', 'closed'],
  components: {
    ItemSortAddTable,
    ItemSortAddSearchForm,
    ModalContainer,
    CancelButton,
    ButtonContainer,
    ErrorMessage,
  },
  mixins: [modalMixin],
  data() {
    return {
      events: new EventEmitter(),
      firstFetched: false,
      currentQuery: {},
      storeBrand: null,
      error: '',
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/data',
      cursor: 'item/cursor',
      storeBrandDict: 'itemSort/storeBrandDict',
    }),
    filteredItems() {
      const storeBrand = this.storeBrand ?? -1
      const dict = this.storeBrandDict[storeBrand] ?? {}
      return this.items.filter(({ id }) => !dict[id])
    },
  },
  methods: {
    async open(params = {}) {
      const { storeBrand = null } = params

      this.storeBrand = storeBrand

      this.$refs.container.open()

      this.$store.commit('item/clear')
      this.$store.commit('item/setCurrentPage', 0)
      this.$store.commit('item/setReachedEnd', false)

      await this.$store.dispatch('item/fetchCursor', {
        params: {
          mainStoreBrand: this.storeBrand ? [this.storeBrand] : [],
        },
      })

      this.firstFetched = true

      this.events.emit('feached')

      this.$refs.itemSortAddTable.resetChecked()
    },

    async handleReachedEnd($state) {
      try {
        if (!this.firstFetched) {
          await new Promise((resolve) => this.events.once('feached', resolve))
          $state.loaded()
          return
        }

        const params = {
          ...this.currentQuery,
          mainStoreBrand: this.storeBrand ? [this.storeBrand] : [],
        }

        await this.$store.dispatch('item/nextPage', { params })

        if (this.cursor.isReachedEnd) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } catch (error) {
        console.error(error)
        $state.error()
      }
    },

    async handleSearch(params) {
      this.currentQuery = { ...params }

      this.firstFetched = false

      this.$store.commit('item/clear')

      await this.$store.dispatch('item/fetchCursor', {
        params: {
          ...params,
          mainStoreBrand: this.storeBrand ? [this.storeBrand] : [],
        },
      })

      this.firstFetched = true

      this.events.emit('feached')

      this.$refs.itemSortAddTable.resetChecked()

      this.$refs.itemSortAddTable.resetLoadingState()
    },

    handleCancel() {
      this.destroy()
      this.close()
    },

    handleAdd() {
      const ids = this.$refs.itemSortAddTable.getCheckedIds()

      if (ids.length === 0) {
        this.error = '一つ以上選択してください。'
        return
      }

      this.$emit('add', { itemId: [...ids], storeBrand: this.storeBrand })
      this.destroy()
      this.close()
    },

    destroy() {
      this.$refs.itemSortAddTable.resetChecked()
      this.storeBrand = null
      this.firstFetched = false
      this.$store.commit('item/clear')
      this.$store.commit('item/setCurrentPage', 0)
      this.$store.commit('item/setReachedEnd', false)
      this.error = ''
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

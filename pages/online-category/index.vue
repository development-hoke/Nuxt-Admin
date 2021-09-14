<template>
  <div>
    <breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <LargeTitle>オンライン分類</LargeTitle>
            <div class="row mb-2">
              <ControlPanel class="col s12">
                <ButtonContainer type="primary" @click="handleClickDownloadCsv"
                  >CSV出力</ButtonContainer
                >
              </ControlPanel>
            </div>

            <div class="row mb-3">
              <tree-view-input
                v-if="!$fetchState.pending"
                :tree="tree"
                name="オンライン分類"
                :max-level="maximumTreeLevel"
                @add="handleAdd"
                @edit="handleEdit"
                @remove="handleRevmoe"
                @move="handleMove"
              />
              <online-category-form-modal ref="formModal" />
            </div>
            <Loading :show="$fetchState.pending" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import TreeViewInput from '@/components/organisms/input/TreeViewInput'
import OnlineCategoryFormModal from '@/components/organisms/modal/OnlineCategoryFormModal'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import ControlPanel from '@/components/molecules/panel/ControlPanel'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'

const MAXIMUM_TREE_LEVEL = 5

export default {
  components: {
    LargeTitle,
    Breadcrumb,
    TreeViewInput,
    OnlineCategoryFormModal,
    ButtonContainer,
    ControlPanel,
  },
  async fetch() {
    await this.$store.dispatch('onlineCategory/fetch')
  },
  data() {
    return {
      maximumTreeLevel: MAXIMUM_TREE_LEVEL,
      breadcrumbs: [
        {
          name: 'オンライン分類',
          route: { name: 'online-category' },
        },
        {
          name: 'オンライン分類一覧',
          route: { name: 'online-category' },
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      tree: 'onlineCategory/tree',
      treeCache: 'onlineCategory/treeCache',
    }),
  },
  methods: {
    handleAdd(parent) {
      this.$refs.formModal.open('create', parent)
    },
    handleEdit(target) {
      const parent = this.treeCache[target.parentId]
      this.$refs.formModal.open('edit', parent, target)
    },
    async handleRevmoe({ id }) {
      try {
        this.$store.commit('common/loading', true)
        await this.$store.dispatch('onlineCategory/deleteNode', { id })
        this.$toast.success('オンライン分類を削除しました。')
      } catch (error) {
        this.$toast.error('オンライン分類の削除に失敗しました。')
        console.error(error)
        throw error
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    async handleMove({ id, sort, parentId }) {
      try {
        this.$store.commit('common/loading', true)
        await this.$store.dispatch('onlineCategory/update', {
          id,
          params: { sort, parentId },
        })
        this.$toast.success('オンライン分類を更新しました。')
      } catch (error) {
        this.$toast.error('オンライン分類の更新に失敗しました。')
        console.error(error)
        throw error
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    async handleClickDownloadCsv() {
      try {
        this.$store.commit('common/loading', true)
        const { data, headers } = await this.$api.onlineCategory.downloadCsv()
        const fileName = extractAttachmentFileName(headers)
        downloadFile(data, fileName)
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<template>
  <div class="row">
    <Breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <LargeTitle>商品優先度表示登録</LargeTitle>
              <div class="row">
                <ControlPanel class="col s12">
                  <div class="input-field inline panel-content">
                    <span class="input-label">ストアブランド</span>
                    <SelectNavigation
                      :options="storeBrandOptions"
                      :default-value="selectedStoreBrand"
                      param-name="store_brand"
                    />
                  </div>
                </ControlPanel>
              </div>
              <div class="row">
                <div class="col s12">
                  <ItemSortTable
                    :items="itemSorts"
                    :fetch-pending="$fetchState.pending"
                    @sorted="$toast.success('商品優先度表示を更新しました。')"
                    @error="(error) => $toast.error(...error)"
                    @add="handleAdd"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ItemSortAddModal ref="itemSortAddModal" @add="handleCreate" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import ItemSortTable from '@/components/organisms/table/ItemSortTable'
import ControlPanel from '@/components/molecules/panel/ControlPanel'
import SelectNavigation from '@/components/molecules/input/SelectNavigation'
import ItemSortAddModal from '@/components/organisms/modal/ItemSortAddModal'
import { extractValidationError } from '@/plugins/vee-validate'

export default {
  components: {
    Breadcrumb,
    LargeTitle,
    ItemSortTable,
    ControlPanel,
    SelectNavigation,
    ItemSortAddModal,
  },
  watchQuery: true,
  async fetch() {
    const storeBrand = this.$route.query.store_brand

    this.$store.commit('itemSort/clear')

    await Promise.all([
      this.$store.dispatch('itemSort/fetch', { params: { storeBrand } }),
      this.$store.dispatch('enum/fetch'),
    ])

    this.selectedStoreBrand = storeBrand ?? null
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '商品管理',
          route: { name: 'item' },
        },
        {
          name: '商品優先度表示登録',
          route: { name: 'item-priority' },
        },
      ],
      selectedStoreBrand: null,
    }
  },
  computed: {
    ...mapGetters({
      enumOptions: 'enum/options',
      itemSorts: 'itemSort/data',
    }),

    storeBrandOptions() {
      const options = [{ name: '総合', code: null }]

      return options.concat(this.enumOptions['common/storeBrand'] ?? [])
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleAdd() {
      this.$refs.itemSortAddModal.open({
        storeBrand: this.selectedStoreBrand,
      })
    },

    async handleCreate(params) {
      if (this.$store.getters['common/pending']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('itemSort/create', { params })
        this.$toast.success('商品優先度表示を追加しました。')
      } catch (error) {
        const fields = ['itemId', 'storeBrand', 'global']

        const messageDict = extractValidationError(error)

        const field = fields.find((field) => messageDict[field]) ?? []
        this.$toast.error(...messageDict[field])

        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

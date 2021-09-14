<template>
  <div class="row">
    <Breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <LargeTitle>トップ管理</LargeTitle>
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
              <LargeTitle>メインバナー管理</LargeTitle>
              <div class="row">
                <div class="col s12">
                  <TopContentMainVisualSortTable
                    :items="topContent.mainVisuals"
                    :fetch-pending="$fetchState.pending"
                    @sorted="$toast.success('メインバナーを更新しました。')"
                    @error="(error) => $toast.error(...error)"
                    @add="handleAddMainVisual"
                  />
                </div>
                <TopContentMainVisualAddModal
                  ref="topContentMainVisualAddModal"
                  @add="handleCreateMainVisual"
                />
              </div>
              <LargeTitle>新着商品</LargeTitle>
              <div class="row">
                <div class="col s12">
                  <TopContentNewItemSortTable
                    :items="topContent.newItems"
                    :fetch-pending="$fetchState.pending"
                    @sorted="$toast.success('新着商品を更新しました。')"
                    @error="(error) => $toast.error(...error)"
                    @add="handleAddNewItem"
                  />
                </div>
                <TopContentNewItemAddModal
                  ref="topContentNewItemAddModal"
                  :current-items="topContent.newItems.length"
                  @add="handleCreateNewItem"
                />
              </div>
              <LargeTitle>おすすめ商品</LargeTitle>
              <div class="row">
                <div class="col s12">
                  <TopContentPickupSortTable
                    :items="topContent.pickups"
                    :fetch-pending="$fetchState.pending"
                    @sorted="$toast.success('おすすめ商品を更新しました。')"
                    @error="(error) => $toast.error(...error)"
                    @add="handleAddPickup"
                  />
                </div>
                <TopContentPickupAddModal
                  ref="topContentPickupAddModal"
                  :current-items="topContent.pickups.length"
                  @add="handleCreatePickup"
                />
              </div>
              <div class="row">
                <div class="col s6">
                  <LargeTitle>特集の背景色の設定</LargeTitle>
                </div>
                <div class="col s6 mt-4">
                  <color-picker-with-input
                    v-model="backgroundColor"
                    @input="(value) => handleBackGroundColorUpdate(value)"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col s6">
                  <LargeTitle>トップ表示の特集</LargeTitle>
                  <TopContentFeaturesAndNewsTable
                    :item-origin="topContent.features"
                    :items="features"
                    :plans="plan"
                    :fetch-pending="$fetchState.pending"
                    name="特集"
                    :place="displayPlaceFeature"
                    @sorted="$toast.success('トップ表示の特集を更新しました。')"
                    @error="(error) => $toast.error(...error)"
                    @add="(value) => handleAddFeatures(value)"
                  />
                </div>
                <div class="col s6">
                  <LargeTitle>トップに表示するNEWS</LargeTitle>
                  <TopContentFeaturesAndNewsTable
                    :item-origin="topContent.news"
                    :items="news"
                    :plans="plan"
                    :fetch-pending="$fetchState.pending"
                    name="NEWS"
                    :place="displayPlaceNews"
                    @sorted="$toast.success('トップ表示のNEWSを更新しました。')"
                    @error="(error) => $toast.error(...error)"
                    @add="(value) => handleAddNews(value)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s6">
                  <div class="table-title">トップ表示のスタリング</div>
                  <radiobox
                    label=""
                    :options="[
                      { name: 'PV数順で表示する', code: 'vu' },
                      { name: '手動で表示する', code: 'js' },
                    ]"
                  ></radiobox>
                  <div class="small-text">
                    ※スタッフスタートのコーディネートIDを入力してください
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>135300000</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>353535353535</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import TopContentMainVisualSortTable from '@/components/organisms/table/TopContentMainVisualSortTable'
import Radiobox from '@/components/molecules/form/RadioBox'
import ControlPanel from '@/components/molecules/panel/ControlPanel'
import SelectNavigation from '@/components/molecules/input/SelectNavigation'
import TopContentMainVisualAddModal from '@/components/organisms/modal/TopContentMainVisualAddModal'
import TopContentNewItemSortTable from '@/components/organisms/table/TopContentNewItemSortTable'
import TopContentNewItemAddModal from '@/components/organisms/modal/TopContentNewItemAddModal'
import TopContentPickupAddModal from '@/components/organisms/modal/TopContentPickupAddModal'
import TopContentPickupSortTable from '@/components/organisms/table/TopContentPickupSortTable'
import TopContentFeaturesAndNewsTable from '@/components/organisms/table/TopContentFeaturesAndNewsTable'
import ColorPickerWithInput from '@/components/molecules/input/ColorPickerWithInput'
import { extractValidationError } from '@/plugins/vee-validate'

const DISPLAY_PLACE_FEATURE = 1
const DISPLAY_PLACE_NEWS = 2

export default {
  components: {
    Breadcrumb,
    LargeTitle,
    TopContentMainVisualSortTable,
    TopContentNewItemSortTable,
    TopContentPickupSortTable,
    Radiobox,
    ControlPanel,
    SelectNavigation,
    TopContentMainVisualAddModal,
    TopContentNewItemAddModal,
    TopContentPickupAddModal,
    TopContentFeaturesAndNewsTable,
    ColorPickerWithInput,
  },
  watchQuery: true,
  async fetch() {
    const storeBrand = this.$route.query.store_brand ?? null

    await Promise.all([
      this.$store.dispatch('topContent/fetchByStoreBrand', { storeBrand }),
      this.$store.dispatch('plan/fetchByStoreBrand', { storeBrand }),
      this.$store.dispatch('enum/fetch'),
    ])

    this.selectedStoreBrand = storeBrand
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'トップ管理',
          route: { name: 'top-content' },
        },
      ],
      selectedStoreBrand: null,
      displayPlaceFeature: DISPLAY_PLACE_FEATURE,
      displayPlaceNews: DISPLAY_PLACE_NEWS,
    }
  },
  computed: {
    ...mapGetters({
      enumOptions: 'enum/options',
      topContent: 'topContent/data',
      plan: 'plan/data',
      loading: 'common/loading',
    }),
    storeBrandOptions() {
      const options = [{ name: '総合', code: null }]

      return options.concat(this.enumOptions['common/storeBrand'] ?? [])
    },
    features() {
      return this.topContent.features.map((item) => item.planId)
    },
    news() {
      return this.topContent.news.map((item) => item.planId)
    },
    backgroundColor: {
      get() {
        return this.topContent.backgroundColor || 'black'
      },
      set(val) {
        this._backgroundColor = val
      },
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleAddMainVisual() {
      this.$refs.topContentMainVisualAddModal.open()
    },
    async handleCreateMainVisual(params) {
      if (this.loading) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('topContent/createMainVisuals', {
          id: this.topContent.id,
          params,
        })
        this.$toast.success('メインバナーを追加しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const errorString =
          errors.spPath || errors.pcPath || errors.url || errors.global || ''
        this.$toast.error(...errorString)

        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    handleAddNewItem() {
      this.$refs.topContentNewItemAddModal.open({
        storeBrand: this.selectedStoreBrand,
      })
    },
    async handleCreateNewItem(params) {
      if (this.loading) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('topContent/createNewItems', {
          id: this.topContent.id,
          params,
        })
        this.$toast.success('新着商品を追加しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const errorString = errors.itemId || errors.global || []
        this.$toast.error(...errorString)

        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    handleAddPickup() {
      this.$refs.topContentPickupAddModal.open({
        storeBrand: this.selectedStoreBrand,
      })
    },
    async handleCreatePickup(params) {
      if (this.loading) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('topContent/createPickups', {
          id: this.topContent.id,
          params,
        })
        this.$toast.success('おすすめ商品を追加しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const errorString = errors.itemId || errors.global || []
        this.$toast.error(...errorString)

        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    async handleBackGroundColorUpdate(value) {
      if (this.loading) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('topContent/updateBackGroundColor', {
          id: this.topContent.id,
          params: {
            background_color: value,
          },
        })
        this.$toast.success('特集の背景色を更新しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const errorString = errors.global || []
        this.$toast.error(...errorString)

        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    async handleAddFeatures(value) {
      if (this.loading) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('topContent/updateFeatures', {
          id: this.topContent.id,
          params: {
            plan_id: value,
          },
        })
        this.$toast.success('トップ表示の特集を更新しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const errorString = errors.global || []
        this.$toast.error(...errorString)

        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    async handleAddNews(value) {
      if (this.loading) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('topContent/updateNews', {
          id: this.topContent.id,
          params: {
            plan_id: value,
          },
        })
        this.$toast.success('トップ表示のNEWSを更新しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const errorString = errors.global || []
        this.$toast.error(...errorString)

        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style scoped>
.title {
  font-size: 20px !important;
  margin-bottom: 20px;
}
.add-new-section {
  margin: 1rem 0 3rem 0;
  text-align: center;
}
.color-picker-container {
  display: flex;
  align-items: center;
  margin: 3rem 0;
}
.color-picker-container .control-label {
  font-size: 1rem;
  margin-right: 1rem;
}
.color-picker-container #color-picker {
  width: 200px;
  text-align: center;
}

table {
  margin: 1rem 0 3rem 0;
}
.table-title {
  margin: 1rem 0;
}
.vertical-radio-group {
  margin: 1rem 0;
}
.small-text {
  font-size: 0.8rem;
}
select {
  border-bottom: 0;
}
</style>

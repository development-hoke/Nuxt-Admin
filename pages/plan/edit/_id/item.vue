<template>
  <div>
    <div class="container">
      <Loading :show="$fetchState.pending" />
      <div class="section">
        <div class="row mb-2">
          <ControlPanel class="col s12">
            <ButtonContainer :disabled="loading" @click="handleAddNewItem">
              一括登録
            </ButtonContainer>
          </ControlPanel>
        </div>
        <div class="row">
          <div class="col s12 ml-1 mb-3">
            <label for="" class="control-label"></label>
            <checkbox
              v-model="isItemSetting"
              name="is_item_setting"
              label="商品一覧を掲載する"
              vid="is_item_setting"
              :disabled="isItemSettingPending"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <PlanItemListTable
              v-if="!$fetchState.pending"
              :items="plan.items"
              :type="type"
            />
          </div>
        </div>
        <PlanItemAddModal ref="planItemAddModal" @add="handleCreateNewItem" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import PlanItemListTable from '@/components/organisms/table/PlanItemListTable'
import ControlPanel from '@/components/molecules/panel/ControlPanel'
import Checkbox from '@/components/molecules/form/Checkbox'
import PlanItemAddModal from '@/components/organisms/modal/PlanItemAddModal'
import { extractValidationError } from '@/plugins/vee-validate'

export default {
  components: {
    ButtonContainer,
    PlanItemListTable,
    ControlPanel,
    Checkbox,
    PlanItemAddModal,
  },
  async fetch() {
    const { id } = this.$route.params

    await this.$store.dispatch('plan/fetchOne', { id })

    this.isItemSetting = this.plan.isItemSetting
  },
  data() {
    return {
      isItemSettingCache: false,
      isItemSettingPending: false,
      type: 'edit',
    }
  },
  computed: {
    ...mapGetters({
      loading: 'common/loading',
    }),
    planId() {
      return Number(this.$route.params.id)
    },
    plan() {
      return this.$store.getters['plan/find'](this.planId)
    },
    isItemSetting: {
      set(value) {
        if (value !== this.isItemSetting) {
          this.handleUpdateItemSetting(value)
        }
      },
      get() {
        if (this.plan) {
          return this.isItemSettingPending
            ? this.isItemSettingCache
            : this.plan.isItemSetting
        }
        return null
      },
    },
  },
  methods: {
    handleAddNewItem() {
      this.$refs.planItemAddModal.open({
        storeBrand: this.plan.storeBrand,
      })
    },
    async handleUpdateItemSetting(val) {
      try {
        this.$store.commit('common/loading', true)
        this.isItemSettingCache = val
        this.isItemSettingPending = true

        await this.$store.dispatch('plan/updateItemSetting', {
          id: this.planId,
          params: {
            isItemSetting: val,
          },
        })
        this.$toast.success('商品一覧掲載設定を更新しました。')
      } catch (error) {
        this.$toast.error('商品一覧掲載設定の更新に失敗しました。')
        console.error(error)
        // ロールバック
        this.isItemSettingCache = !val
      } finally {
        this.$store.commit('common/loading', false)
        this.isItemSettingPending = false
      }
    },
    async handleCreateNewItem(params) {
      if (this.loading) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('plan/createNewItems', {
          id: this.planId,
          params,
        })
        this.$toast.success('商品一覧に商品を追加しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const errorString = errors.itemId || errors.global || []
        this.$toast.error(...errorString)

        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

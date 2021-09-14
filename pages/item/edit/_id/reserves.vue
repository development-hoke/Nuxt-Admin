<template>
  <div class="tab-content active">
    <Loading :show="$fetchState.pending" />
    <ValidationObserver
      v-show="!$fetchState.pending"
      v-slot="{ handleSubmit }"
      tag="div"
      class="pre-order mb-4"
      :external-errors="serverErrors"
    >
      <MediumTitle class="center-align">予約販売設定</MediumTitle>
      <div class="row mt-3">
        <div class="col s3 right-align-md">
          <span>
            予約設定
          </span>
        </div>
        <div class="col s9">
          <Checkbox
            v-model="inputs.isEnable"
            name="isEnable"
            label="予約を受け付ける"
            rules="required"
          />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col s3 right-align-md filel-label">
          予約受付期間
        </div>
        <div class="col s9">
          <DateitemPickerField
            v-model="inputs.periodFrom"
            rules="date_required"
            name="periodFrom"
            :clear-button="true"
            valid-name="開始日時"
          />
        </div>
      </div>
      <div class="row">
        <div class="col s9 offset-s3">
          <DateitemPickerField
            v-model="inputs.periodTo"
            rules="date_required|date_gt:periodFrom|date_bt:periodFrom, 120"
            name="periodTo"
            :clear-button="false"
            valid-name="終了日時"
          />
        </div>
      </div>
      <div class="row mt-1">
        <div class="col s3 right-align-md filel-label">
          予約販売価格
        </div>
        <div class="col s9">
          <TextField
            v-model="inputs.reservePrice"
            type="number"
            name="reservePrice"
            input-field-class="input-field inline"
            rules="required|integer"
            valid-name="予約販売価格"
          />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col s3 right-align-md">
          <span>
            送料無料設定
          </span>
        </div>
        <div class="col s9">
          <Checkbox
            v-model="inputs.isFreeDelivery"
            name="isFreeDelivery"
            label="送料無料設定"
            rules="required"
          />
        </div>
      </div>
      <div class="row mt-5">
        <div class="col s3 right-align-md">
          予約可能数
        </div>
        <div class="col s9">
          <table class="bordered striped">
            <thead>
              <tr>
                <th data-field="">色番</th>
                <th data-field="">サイズ番</th>
                <th data-field="">予約残在庫数</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="colorId in Object.keys(itemDetailGroups)">
                <tr
                  v-for="(itemDetail, j) in itemDetailGroups[colorId]"
                  :key="itemDetail.id"
                >
                  <td
                    v-if="j === 0"
                    :rowspan="itemDetailGroups[colorId].length"
                  >
                    {{ `${itemDetail.colorId} ${itemDetail.color.name}` }}
                  </td>
                  <td>{{ itemDetail.sizeId }}</td>
                  <td>{{ itemDetail.reservableStock }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col s3 right-align-md filel-label">
          予約在庫僅少表示閾値
        </div>
        <div class="col s9">
          <TextField
            v-model="inputs.limitedStockThreshold"
            type="number"
            name="limitedStockThreshold"
            input-field-class="input-field inline"
            rules="required|integer"
            valid-name="予約在庫僅少表示閾値"
          />
        </div>
      </div>
      <div class="row">
        <div class="col s3 right-align-md filel-label">
          予約在庫切れメール閾値
        </div>
        <div class="col s9">
          <TextField
            v-model="inputs.outOfStockThreshold"
            type="number"
            name="outOfStockThreshold"
            input-field-class="input-field inline"
            rules="required|integer"
            valid-name="予約在庫切れメール閾値"
          />
        </div>
      </div>
      <div class="row">
        <div class="col s3 right-align-md filel-label">
          入荷予定
        </div>
        <div class="col s9">
          <TextField
            v-model="inputs.expectedArrivalDate"
            input-field-class="input-field inline"
            rules="required|max:255"
            name="expectedArrivalDate"
            valid-name="入荷予定"
          />
        </div>
      </div>
      <div class="row">
        <div class="col s3 right-align-md filel-label">
          予約商品の注意書き
        </div>
        <div class="col s9">
          <TextareaField
            v-model="inputs.note"
            name="note"
            valid-name="予約商品の注意書き"
            rules="required|max:10000"
          />
        </div>
      </div>
      <div class="row center">
        <div class="col s12">
          <ButtonSubmit
            color="primary"
            :disabled="$fetchState.pending"
            @onClick="handleSubmit(handleClickSubmit)"
            >登録する</ButtonSubmit
          >
        </div>
      </div>
      <ErrorMessageList
        :messages="serverErrors.global"
        class="mt-2 center-align"
      />
    </ValidationObserver>
  </div>
</template>

<script>
import MediumTitle from '@/components/atoms/title/MediumTitle'
import Checkbox from '@/components/molecules/form/Checkbox'
import DateitemPickerField from '@/components/molecules/form/DateitemPickerField'
import TextField from '@/components/molecules/form/TextField'
import TextareaField from '@/components/molecules/form/TextareaField'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import ErrorMessageList from '@/components/organisms/notice/ErrorMessageList'
import * as httpStatusCode from '@/constants/httpStatusCode'
import { aggrigate } from '@/utils/dataStructure'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  components: {
    MediumTitle,
    Checkbox,
    DateitemPickerField,
    TextField,
    TextareaField,
    ButtonSubmit,
    ErrorMessageList,
  },
  async fetch() {
    await Promise.all([
      this.loadItemReserve(),
      this.$store.dispatch('item/fetchOne', { id: this.itemId }),
    ])

    if (this.isNew) {
      this.$set(this.inputs, 'reservePrice', this.item.retailPrice)
    }
  },
  data() {
    return {
      inputs: {
        isEnable: false,
        periodFrom: null,
        periodTo: null,
        reservePrice: null,
        isFreeDelivery: false,
        limitedStockThreshold: null,
        outOfStockThreshold: null,
        expectedArrivalDate: null,
        note: null,
      },
      serverErrors: {},
      isNew: true,
    }
  },
  computed: {
    item() {
      return this.$store.getters['item/find'](this.itemId)
    },
    itemDetails() {
      if (!this.item) {
        return []
      }

      return this.item.itemDetails
    },
    itemReserve() {
      return this.$store.getters['itemReserve/find'](this.itemId, 'itemId')
    },
    itemId() {
      return Number(this.$route.params.id)
    },
    itemDetailGroups() {
      return aggrigate(this.itemDetails, 'colorId')
    },
  },
  methods: {
    async loadItemReserve() {
      const itemId = this.itemId

      try {
        await this.$store.dispatch('itemReserve/fetchByItemId', { itemId })
      } catch (error) {
        if (
          !error.isAxiosError ||
          error.response.status !== httpStatusCode.NOT_FOUND
        ) {
          throw error
        }
      }

      this.isNew = !this.itemReserve

      if (this.isNew) {
        return
      }

      this.buildInputValues()
    },

    buildInputValues() {
      const inputs = { ...this.itemReserve }
      this.inputs = inputs
    },

    async handleClickSubmit() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.serverErrors = {}

        this.$store.commit('common/loading', true)

        const params = {
          ...this.inputs,
          isEnable: Number(this.inputs.isEnable),
        }

        const method = this.isNew ? 'create' : 'update'

        await this.$store.dispatch(`itemReserve/${method}`, {
          itemId: this.itemId,
          params,
        })

        this.buildInputValues()

        this.isNew = false

        this.$toast.success('予約販売設定を更新しました')
      } catch (error) {
        console.error(error)
        assignErrors(this.serverErrors, error)
        this.$toast.error('予約販売設定の更新に失敗しました')
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style scoped>
.pre-order {
  padding: 0 20px;
}
.filel-label {
  margin-top: 30px;
}
</style>

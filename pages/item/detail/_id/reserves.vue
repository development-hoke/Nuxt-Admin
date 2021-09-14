<template>
  <div class="tab-content active">
    <Loading :show="$fetchState.pending" />
    <div v-if="!$fetchState.pending" class="pre-order mb-4">
      <MediumTitle class="center-align">予約販売設定</MediumTitle>
      <div v-if="!itemReserve" class="mt-3">設定がありません</div>
      <template v-else>
        <div class="row mt-3">
          <div class="col s3 right-align-md">
            <span>
              予約設定
            </span>
          </div>
          <div class="col s9">
            <span>{{
              Number(itemReserve.isEnable)
                ? '予約を受け付ける'
                : '予約を受け付けない'
            }}</span>
          </div>
        </div>
        <div class="row mt-1">
          <div class="col s3 right-align-md filel-label">
            予約受付期間
          </div>
          <div class="col s9 filel-content">
            <span>{{
              dayjs(itemReserve.periodFrom).format('YYYY/MM/DD HH:mm')
            }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col s9 offset-s3 filel-content">
            <span>{{
              dayjs(itemReserve.periodTo).format('YYYY/MM/DD HH:mm')
            }}</span>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col s3 right-align-md">
            予約販売価格
          </div>
          <div class="col s9">
            <span>{{ yen(itemReserve.reservePrice) }}</span>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col s3 right-align-md">
            <span>
              送料無料設定
            </span>
          </div>
          <div class="col s9">
            <span>{{
              Number(itemReserve.isFreeDelivery) ? '無料' : '有料'
            }}</span>
          </div>
        </div>
        <div class="row mt-3">
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
                    <td v-if="j === 0" :rowspan="itemDetail.length">
                      {{ `${itemDetail.colorId} ${itemDetail.color.name}` }}
                    </td>
                    <td>{{ itemDetail.sizeId }}</td>
                    <td>{{ itemDetail.ecStock }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col s3 right-align-md">
            予約在庫僅少表示閾値
          </div>
          <div class="col s9">
            <span>{{ itemReserve.limitedStockThreshold }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col s3 right-align-md filel-label">
            予約在庫切れメール閾値
          </div>
          <div class="col s9 filel-content">
            <span>{{ itemReserve.outOfStockThreshold }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col s3 right-align-md filel-label">
            入荷予定
          </div>
          <div class="col s9 filel-content">
            <span>{{ itemReserve.expectedArrivalDate }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col s3 right-align-md filel-label">
            予約商品の注意書き
          </div>
          <div class="col s9 filel-content-note">
            <pre>{{ itemReserve.note }}</pre>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import MediumTitle from '@/components/atoms/title/MediumTitle'
import * as httpStatusCode from '@/constants/httpStatusCode'
import { aggrigate } from '@/utils/dataStructure'
import { yen, percentile } from '@/utils/format'

export default {
  components: {
    MediumTitle,
  },
  async fetch() {
    await Promise.all([
      this.loadItemReserve(),
      this.$store.dispatch('item/fetchOne', { id: this.itemId }),
      this.$store.dispatch('enum/fetch'),
    ])
  },
  computed: {
    enumKv() {
      return this.$store.getters['enum/kv']
    },
    item() {
      return this.$store.getters['item/find'](this.itemId)
    },
    itemDetails() {
      if (!this.item) {
        return []
      }

      return this.item.itemDetails
    },
    reserveStatusKv() {
      return this.enumKv['item/reserveStatus']
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
    dayjs(...args) {
      return dayjs(...args)
    },
    yen(...args) {
      return yen(...args)
    },
    percentile(...args) {
      return percentile(...args)
    },

    async loadItemReserve() {
      try {
        const itemId = this.itemId
        await this.$store.dispatch('itemReserve/fetchByItemId', { itemId })
      } catch (error) {
        if (
          !error.isAxiosError ||
          error.response.status !== httpStatusCode.NOT_FOUND
        ) {
          throw error
        }
      }
    },
  },
}
</script>

<style scoped>
.pre-order {
  padding: 0 20px;
}
.filel-label,
.filel-content {
  margin-top: 30px;
}
.filel-content-note {
  margin-top: 15px;
}
</style>

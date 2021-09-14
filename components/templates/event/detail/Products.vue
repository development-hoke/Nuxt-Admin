<template>
  <div class="container">
    <div class="row mb-2">
      <div class="col s12">
        <table class="">
          <thead>
            <tr>
              <th data-field="photo"></th>
              <th data-field="product-name">商品名</th>
              <th data-field="product-no">商品番号</th>
              <th data-field="prev">上代</th>
              <th data-field="rate">イベント値引率</th>
              <th data-field="count">在庫数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eventItem in eventItems" :key="eventItem.id">
              <td>
                <img
                  v-if="eventItem.item.itemImages.length > 0"
                  :src="eventItem.item.itemImages[0].urlM"
                  width="60"
                />
              </td>
              <td>{{ eventItem.item.name }}</td>
              <td>{{ eventItem.item.productNumber }}</td>
              <td>{{ yen(eventItem.item.retailPrice) }}</td>
              <td>
                <template v-if="isDiscountFlat">
                  {{ event.discountRate }}
                </template>
                <template v-else>
                  {{ eventItem.discountRate }}
                </template>
              </td>
              <td>{{ eventItem.item.ecStock }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s12 pagination">
        <Pagination
          :total-count="pagination.total"
          :current-page="pagination.currentPage"
          :per-page="pagination.perPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { yen } from '@/utils/format'
import Pagination from '@/components/molecules/pagination/Pagination'

export default {
  name: 'EventProducts',
  components: {
    Pagination,
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  async fetch() {
    const { id } = this.$route.params
    const params = this.$route.query
    await this.$store.dispatch('eventItem/fetch', { eventId: id, params })
  },
  data() {
    return {
      yen,
    }
  },
  computed: {
    eventItems() {
      return this.$store.getters['eventItem/data']
    },
    pagination() {
      return this.$store.getters['eventItem/pagination']
    },
    eventId() {
      return this.$route.params.id
    },
    discountType() {
      return this.$store.getters['enum/kv']['event/discountType'] || {}
    },
    isDiscountFlat() {
      return Number(this.event.discountType) === Number(this.discountType.flat)
    },
  },
}
</script>

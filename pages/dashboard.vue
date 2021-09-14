<template>
  <div>
    <div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
      <div class="container">
        <div class="row">
          <div class="col s12 m6 l6">
            <h5 class="breadcrumbs-title mt-0 mb-0">
              <span>ダッシュボード</span>
            </h5>
          </div>
          <div class="col s12 m6 l6 right-align-md">
            <ol class="breadcrumbs mb-0">
              <li class="breadcrumb-item">
                <a href="/dashboard">ダッシュボード</a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <div class="row mb-2">
              <span class="title">
                ダッシュボード
              </span>
            </div>
            <div class="row">
              <div class="row mb-1">
                <span class="table-title">
                  昨日の売上(受注日計上)
                </span>
              </div>
              <div class="col s12">
                <table class="bordered striped">
                  <thead>
                    <tr>
                      <th data-field="">全体</th>
                      <th
                        v-for="(value, index) in brandLabels"
                        :key="index"
                        data-field=""
                      >
                        {{ value }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {{ formatNumber(sumAggregration(dailyAggregration)) }}
                      </td>
                      <td
                        v-for="(value, index) in mainStoreBrands"
                        :key="index"
                      >
                        {{
                          dailyAggregration[value]
                            ? formatNumber(dailyAggregration[value])
                            : 0
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row">
              <div class="row mb-1 mt-2">
                <span class="table-title">
                  昨日までの今月の累計売上(受注日計上)
                </span>
              </div>
              <div class="col s12">
                <table class="bordered striped">
                  <thead>
                    <tr>
                      <th data-field="">全体</th>
                      <th
                        v-for="(value, index) in brandLabels"
                        :key="index"
                        data-field=""
                      >
                        {{ value }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {{
                          formatNumber(
                            sumAggregration(monthlyAggregrationByOrder)
                          )
                        }}
                      </td>
                      <td
                        v-for="(value, index) in mainStoreBrands"
                        :key="index"
                      >
                        {{
                          monthlyAggregrationByOrder[value]
                            ? formatNumber(monthlyAggregrationByOrder[value])
                            : 0
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row">
              <div class="row mb-1 mt-2">
                <span class="table-title">
                  昨日までの今月の累計売上(発送日計上)
                </span>
              </div>
              <div class="col s12">
                <table class="bordered striped">
                  <thead>
                    <tr>
                      <th data-field="">全体</th>
                      <th
                        v-for="(value, index) in brandLabels"
                        :key="index"
                        data-field=""
                      >
                        {{ value }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {{
                          formatNumber(
                            sumAggregration(monthlyAggregrationByDelivery)
                          )
                        }}
                      </td>
                      <td
                        v-for="(value, index) in mainStoreBrands"
                        :key="index"
                      >
                        {{
                          monthlyAggregrationByDelivery[value]
                            ? formatNumber(monthlyAggregrationByDelivery[value])
                            : 0
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row mb-5">
              <div class="row mb-1 mt-2">
                <span class="table-title">
                  昨日在庫が追加されたもの(JAN 単位)
                </span>
              </div>
              <div class="col s12">
                <InventoryListTable :items="identifications" />
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
import dayjs from 'dayjs'
import InventoryListTable from '@/components/organisms/table/InventoryListTable'
import { formatNumber } from '@/utils/format'

export default {
  name: 'Dashboard',
  components: { InventoryListTable },
  async fetch() {
    const cleanQueryParams = {}
    const yesterday = dayjs().subtract('1', 'day').format('YYYY-MM-DD')
    const today = dayjs().format('YYYY-MM-DD')
    cleanQueryParams.last_added_stock_date_from = yesterday
    cleanQueryParams.last_added_stock_date_to = today
    await Promise.all([
      this.$store.dispatch('enum/fetch'),
      this.$store.dispatch('salesAggregation/order/fetchDailyAggregration'),
      this.$store.dispatch('salesAggregation/order/fetchMonthlyAggregration'),
      this.$store.dispatch('itemDetailIdentifications/fetch', cleanQueryParams),
    ])
  },
  computed: {
    ...mapGetters({
      dailyAggregration: 'salesAggregation/order/dailyAggregration',
      monthlyAggregration: 'salesAggregation/order/monthlyAggregration',
      enumKeyLabel: 'enum/keyLabel',
      enumKv: 'enum/kv',
      enumVk: 'enum/vk',
      enumValueLabel: 'enum/valueLabel',
      identifications: 'itemDetailIdentifications/data',
      pagination: 'itemDetailIdentifications/pagination',
    }),
    brandLabels() {
      return this.enumKeyLabel['common/storeBrand'] ?? {}
    },
    mainStoreBrands() {
      return this.enumKv['common/storeBrand'] ?? {}
    },
    saleTypeKv() {
      return this.enumKv['order/saleType'] ?? {}
    },
    monthlyAggregrationByOrder() {
      return this.monthlyAggregration.order ?? {}
    },
    monthlyAggregrationByDelivery() {
      return this.monthlyAggregration.delivery ?? {}
    },
  },
  methods: {
    sumAggregration(aggregration) {
      return Object.keys(aggregration).reduce(
        (sum, key) => sum + parseInt(aggregration[key] || 0),
        0
      )
    },
    formatNumber(...args) {
      return formatNumber(...args)
    },
  },
}
</script>

<style scoped>
.title {
  font-size: 20px;
}
.breadcrumbs-bg-image {
  background-image: url('~assets/breadcrumb-bg.jpg') !important;
}
.materialboxed {
  margin: auto;
}
.color-num {
  min-width: 48px;
}
.table-title {
  padding-left: 15px;
}
</style>

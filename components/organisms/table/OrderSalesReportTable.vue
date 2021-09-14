<template>
  <div class="wrapper">
    <table class="bordered striped highlight">
      <thead>
        <tr v-if="!sumGroup1Flg">
          <th>{{ group1Label }}</th>
          <td
            v-for="(group1, index) in group1List"
            :key="index"
            :colspan="group2List[group1].length * 2"
          >
            {{ group1 }}
          </td>
        </tr>
        <tr v-if="!sumGroup2Flg">
          <th>{{ group2Label }}</th>
          <template v-for="(group1, index1) in group1List">
            <td
              v-for="(group2, index2) in group2List[group1]"
              :key="`${index1}-${index2}`"
              colspan="2"
            >
              {{ group2 }}
            </td>
          </template>
        </tr>
        <tr>
          <th>日付</th>
          <template v-for="(group1, index1) in group1List">
            <template v-for="(group2, index2) in group2List[group1]">
              <td
                v-for="key in ['sale', 'employee']"
                :key="`${index1}-${index2}-${key}`"
              >
                {{ saleTypeLabels[key] }}
              </td>
            </template>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in uniqueUnits" :key="unit">
          <th>{{ unit }}</th>
          <template v-for="(group1, index1) in group1List">
            <template v-for="(group2, index2) in group2List[group1]">
              <td
                v-for="key in ['sale', 'employee']"
                :key="`${index1}-${index2}-${key}`"
              >
                <template v-if="groups[group1][group2][saleTypeKv[key]][unit]">
                  <a
                    href=""
                    @click.prevent="
                      handleClickTarget(
                        group1,
                        group2,
                        key,
                        groups[group1][group2][saleTypeKv[key]][unit].timestamp
                      )
                    "
                  >
                    <template>
                      {{ groups[group1][group2][saleTypeKv[key]][unit].target }}
                    </template>
                  </a>
                </template>
                <template v-else>-</template>
              </td>
            </template>
          </template>
        </tr>
        <NoDataTableRow v-if="uniqueUnits.length === 0" />
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import {
  TARGET_TYPE_PRICE,
  TARGET_TYPE_AMOUNT,
} from '@/constants/salesReport/targetType'
import { formatNumber } from '@/utils/format'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'

export default {
  name: 'OrderSalesReportTable',
  components: {
    NoDataTableRow,
  },
  emits: ['click-target'],
  props: {
    target: {
      type: Number,
      default: TARGET_TYPE_PRICE,
      validate(value) {
        return [TARGET_TYPE_PRICE, TARGET_TYPE_AMOUNT].includes(value)
      },
    },
    sumGroup1Flg: {
      type: Number,
      default: 0,
    },
    sumGroup2Flg: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      unitCache: {},
      targetPropMap: {
        [TARGET_TYPE_PRICE]: 'totalPrice',
        [TARGET_TYPE_AMOUNT]: 'totalAmount',
      },
    }
  },
  computed: {
    ...mapGetters({
      items: 'salesAggregation/order/data',
      requestParams: 'salesAggregation/order/requestParams',
      enumKv: 'enum/kv',
      enumVk: 'enum/vk',
      enumKeyLabel: 'enum/keyLabel',
      enumValueLabel: 'enum/valueLabel',
    }),
    groups() {
      const { sale, employee } = this.saleTypeKv

      return this.items.reduce((group, item, index) => {
        const group1 = this.sumGroup1Flg ? 0 : item.group1
        const group2 = this.sumGroup2Flg ? 0 : item.group2
        const saleType = item.saleType

        if (!group[group1]) {
          group[group1] = {}
        }

        if (!group[group1][group2]) {
          group[group1][group2] = {
            [sale]: {},
            [employee]: {},
          }
        }

        const unit = this.units[index]

        if (!group[group1][group2][saleType][unit]) {
          group[group1][group2][saleType][unit] = {
            target: '',
            timestamp: this.unitTimesampDict[unit],
          }
        }

        group[group1][group2][saleType][unit].target += `${formatNumber(
          item[this.targetPropMap[TARGET_TYPE_PRICE]]
        )} / ${item[this.targetPropMap[TARGET_TYPE_AMOUNT]]}`

        return group
      }, {})
    },
    units() {
      return this.items.map((item) => this.getAggregationUnit(item))
    },
    unitTimesampDict() {
      return this.units.reduce((dict, unit) => {
        return Object.assign(dict, { [unit]: dayjs(unit).unix() })
      }, {})
    },
    uniqueUnits() {
      const dict = this.unitTimesampDict
      return Object.keys(dict).sort((t1, t2) => t1 - t2)
    },
    group1List() {
      return Object.keys(this.groups).sort()
    },
    group2List() {
      const groups = this.groups
      return this.group1List.reduce((list, group1) => {
        return Object.assign(list, {
          [group1]: Object.keys(groups[group1]).sort(),
        })
      }, {})
    },
    actualGroup1List() {
      const dict = this.items.reduce((dict, item) =>
        Object.assign(dict, { [item.group1]: item.group1 })
      )

      return Object.keys(dict).map(Number)
    },
    actualGroup2List() {
      const dict = this.items.reduce((dict, item) =>
        Object.assign(dict, { [item.group2]: item.group2 })
      )

      return Object.keys(dict).map(Number)
    },
    unitKv() {
      return this.enumKv['orderAggregation/unit'] ?? {}
    },
    saleTypeKv() {
      return this.enumKv['order/saleType'] ?? {}
    },
    saleTypeLabels() {
      return this.enumKeyLabel['order/saleType'] ?? {}
    },
    group1ValueLabel() {
      return this.enumValueLabel['orderAggregation/group1'] ?? {}
    },
    group2ValueLabel() {
      return this.enumValueLabel['orderAggregation/group2'] ?? {}
    },
    group1Label() {
      return this.group1ValueLabel[this.requestParams.group1]
    },
    group2Label() {
      return this.group2ValueLabel[this.requestParams.group2]
    },
    group1Kv() {
      return this.enumKv['orderAggregation/group1'] ?? {}
    },
    group2Kv() {
      return this.enumKv['orderAggregation/group2'] ?? {}
    },
    group1Vk() {
      return this.enumVk['orderAggregation/group1'] ?? {}
    },
    group2Vk() {
      return this.enumVk['orderAggregation/group2'] ?? {}
    },
    saleTypeVk() {
      return this.enumVk['order/saleType'] ?? {}
    },
    group1FieldNames() {
      return {
        [this.group1Kv.organization]: 'organizationId',
        [this.group1Kv.division]: 'divisionId',
        [this.group1Kv.mainStoreBrand]: 'mainStoreBrand',
      }
    },
    group2FieldNames() {
      return {
        [this.group2Kv.department]: 'departmentId',
        [this.group2Kv.onlineCategory]: 'onlineCategoryId',
      }
    },
  },
  methods: {
    formatNumber(...args) {
      return formatNumber(...args)
    },
    getAggregationUnit(item) {
      const key = this.getCacheKey(item.date)

      if (!this.unitCache[key]) {
        this.unitCache[key] = this.formatDate(item.date)
      }

      return this.unitCache[key]
    },
    getCacheKey(dateString) {
      const { unit } = this.requestParams
      return `${unit}:${dateString}`
    },
    formatDate(date) {
      const { unit } = this.requestParams

      switch (Number(unit)) {
        case this.unitKv.daily:
          return dayjs(date).format('YYYY/MM/DD')
        case this.unitKv.weekly:
          return dayjs(date).format('YYYY/MM/DD週')
        case this.unitKv.monthly:
          return dayjs(date).format('YYYY/MM')
        default:
          throw new Error(`unit: ${unit} は不正な値です。`)
      }
    },
    computeDeteTo(date) {
      const { unit } = this.requestParams

      switch (Number(unit)) {
        case this.unitKv.daily:
          return date.add(1, 'day')
        case this.unitKv.weekly:
          return date.add(1, 'week')
        case this.unitKv.monthly:
          return date.add(1, 'month')
        default:
          throw new Error(`unit: ${unit} は不正な値です。`)
      }
    },
    handleClickTarget(group1Value, group2Value, key, timestamp) {
      const { group1, group2 } = this.requestParams

      const dateFrom = dayjs(Number(String(timestamp) + '000'))
      const dateTo = this.computeDeteTo(dateFrom)

      const params = {}

      params.dateFrom = dateFrom.format('YYYY-MM-DD 00:00:00')
      params.dateTo = dateTo.format('YYYY-MM-DD 00:00:00')

      if (!this.sumGroup1Flg) {
        params[this.group1FieldNames[group1]] = [group1Value]
      } else {
        params[this.group1FieldNames[group1]] = [...this.actualGroup1List]
      }

      if (!this.sumGroup2Flg) {
        params[this.group2FieldNames[group2]] = [group2Value]
      } else {
        params[this.group2FieldNames[group2]] = [...this.actualGroup2List]
      }

      params.saleType = this.saleTypeKv[key]
      params.by = this.requestParams.by

      this.$emit('click-target', params)
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}
</style>

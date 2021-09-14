<template>
  <div class="wrapper">
    <table class="bordered striped">
      <thead>
        <tr>
          <th>商品サムネイル</th>
          <th>商品名(from基幹)</th>
          <th>公開ステータス</th>
          <th>商品ステータス</th>
          <th>事部品番</th>
          <th>メーカーコードメーカー品番</th>
          <th>色番</th>
          <th>サイズ番</th>
          <th>JANコード</th>
          <SortableHeaderCell
            :order="sortState.ecStock"
            @click="handleSort('ecStock')"
            ><span>現在庫数</span></SortableHeaderCell
          >
          <SortableHeaderCell
            :order="sortState.reservableStock"
            @click="handleSort('reservableStock')"
            ><span>予約可能在庫数</span></SortableHeaderCell
          >
          <SortableHeaderCell
            :order="sortState.addeddStockYesterday"
            @click="handleSort('addeddStockYesterday')"
            ><span>最新の在庫追加数</span></SortableHeaderCell
          >
          <SortableHeaderCell
            :order="sortState.itemDetailRecords"
            @click="handleSort('itemDetailRecords')"
            ><span>最新の在庫追加日時</span></SortableHeaderCell
          >
          <SortableHeaderCell
            :order="sortState.itemDetailRequestCount"
            @click="handleSort('itemDetailRequestCount')"
            ><span>再入荷リクエスト数</span></SortableHeaderCell
          >
          <th>最新の在庫販売時間</th>
          <SortableHeaderCell
            :order="sortState.slowMovingInventoryDays"
            @click="handleSort('slowMovingInventoryDays')"
            ><span>滞留日数</span></SortableHeaderCell
          >
          <SortableHeaderCell
            :order="sortState.deadInventoryDays"
            @click="handleSort('deadInventoryDays')"
            ><span>不動日数</span></SortableHeaderCell
          >
          <th>商品が公開された日時</th>
          <th>商品の季節記号</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ident in items" :key="ident.id">
          <td>
            <ItemThumbnail
              :image="ident.itemDetail.item.itemImages[0]"
              :alt="ident.itemDetail.item.name"
            />
          </td>
          <td>{{ ident.itemDetail.item.name }}</td>
          <td>{{ ident.itemDetail.status ? '公開' : '非公開' }}</td>
          <td>
            {{ salesStatusValueLabels[ident.itemDetail.item.salesStatus] }}
          </td>
          <td>{{ ident.itemDetail.item.productNumber }}</td>
          <td>{{ ident.itemDetail.item.makerProductNumber }}</td>
          <td>{{ ident.itemDetail.colorId }}</td>
          <td>{{ ident.itemDetail.sizeId }}</td>
          <td>{{ ident.janCode }}</td>
          <td>{{ ident.ecStock }}</td>
          <td>{{ ident.reservableStock }}</td>
          <td>{{ ident.latestAddedStock }}</td>
          <td>{{ ident.latestStockAddedAt }}</td>
          <td>{{ ident.itemDetail.itemDetailRequestCount }}</td>
          <td>{{ ident.itemDetail.lastSalesDate }}</td>
          <td>{{ ident.slowMovingInventoryDays }}</td>
          <td>{{ ident.deadInventoryDays }}</td>
          <td>
            {{ dayjs(ident.itemDetail.statusChangeDate).format('YYYY/MM/DD') }}
          </td>
          <td>{{ ident.itemDetail.item.season.name }}</td>
        </tr>
        <NoDataTableRow v-if="items.length === 0" />
      </tbody>
    </table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import sortableMixin from '@/components/organisms/table/mixins/sortableMixin'
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import SortableHeaderCell from '@/components/molecules/table/SortableHeaderCell'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'
import { ORDER_ASC } from '@/constants/sort'

export default {
  name: 'InventoryListTable',
  components: {
    ItemThumbnail,
    SortableHeaderCell,
    NoDataTableRow,
  },
  mixins: [sortableMixin],
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const sortState = {
      ecStock: ORDER_ASC,
      reservableStock: ORDER_ASC,
      slowMovingInventoryDays: ORDER_ASC,
      deadInventoryDays: ORDER_ASC,
      addeddStockYesterday: ORDER_ASC,
      itemDetailRequestCount: ORDER_ASC,
      itemDetailRecords: ORDER_ASC,
    }

    if (this.$route.query.sort) {
      const [order, column] = this.extractQueryParam(this.$route.query.sort)
      sortState[column] = order
    }

    return {
      sortState,
    }
  },
  computed: {
    enumValueLabels() {
      return this.$store.getters['enum/valueLabel']
    },
    salesStatusValueLabels() {
      return this.enumValueLabels['item/salesStatus'] ?? {}
    },
  },
  methods: {
    dayjs(...args) {
      return dayjs(...args)
    },
  },
}
</script>

<style lang="scss" scoped>
.sortable:hover {
  cursor: pointer;
}
.wrapper {
  overflow-y: auto;
}
</style>

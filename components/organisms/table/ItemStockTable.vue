<template>
  <div class="row">
    <div class="mb-2 col s12">
      <table class="bordered striped">
        <thead>
          <tr>
            <th data-field="">色番</th>
            <th data-field="">サイズ番</th>
            <th data-field="">予約残在庫数</th>
            <th data-field="">色別在庫数</th>
            <th data-field="">総在庫数</th>
            <th data-field="">カラーパネル</th>
            <th data-field="">表示色番名</th>
            <th data-field="">表示順</th>
            <th data-field="">公開有無</th>
            <th data-field="">閾値</th>
            <th data-field="">再入荷リクエスト</th>
          </tr>
        </thead>
        <template v-for="(colorId, i) in coloerIds">
          <template v-for="(detail, j) in groups[colorId]">
            <tr :key="detail.id">
              <td v-if="j === 0" :rowspan="groups[colorId].length">
                {{ `${colorId} ${colorDict[colorId].name}` }}
              </td>
              <td>{{ dict[detail.id].sizeId }}</td>
              <td>{{ dict[detail.id].reservableStock }}</td>
              <td v-if="j === 0" :rowspan="groups[colorId].length">
                {{ computeEcStockSum(groups[colorId]) }}
              </td>
              <td v-if="j === 0 && i === 0" :rowspan="itemDetails.length">
                {{ sumProp(itemDetails, 'ecStock') }}
              </td>
              <td :rowspan="groups[colorId].length">
                <template v-if="colorId">
                  <color-panel :color="colorDict[colorId].colorPanel" />
                </template>
                <template v-else>-</template>
              </td>
              <td :rowspan="groups[colorId].length">
                {{ colorDict[colorId] }}
              </td>
              <td>{{ detail.sort }}</td>
              <td>{{ detail.status ? '有' : '無' }}</td>
              <td>
                {{ dict[detail.id].backOrderbleStockThreshold }} /
                {{ dict[detail.id].storeStock }}
              </td>
              <td>{{ detail.redisplayRequested ? '有' : '無' }}</td>
            </tr>
          </template>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
import ColorPanel from '@/components/atoms/colorPanel/ColorPanel'
import { sumProp } from '@/utils/math'
import { aggrigate, createDict } from '@/utils/dataStructure'

export default {
  name: 'ItemStockTableInput',
  components: {
    ColorPanel,
  },
  props: {
    itemDetails: {
      type: Array,
      required: true,
    },
    colorDict: {
      type: Object,
      required: true,
    },
  },
  computed: {
    groups() {
      return aggrigate(this.itemDetails, 'colorId')
    },
    dict() {
      return createDict(this.itemDetails)
    },
    coloerIds() {
      const groups = this.groups

      return Object.keys(groups).sort(
        (id1, id2) => groups[id1][0].sort - groups[id2][0].sort
      )
    },
  },
  methods: {
    sumProp(...args) {
      return sumProp(...args)
    },
    computeEcStockSum(items) {
      const dict = this.dict
      return items.reduce((sum, { id }) => dict[id].ecStock + sum, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
.color-panel {
  margin: 0 auto;
}
</style>

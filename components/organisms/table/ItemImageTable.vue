<template>
  <div class="row">
    <div class="col s1"></div>
    <div class="col s10">
      <table class="bordered striped">
        <thead>
          <tr>
            <th data-field=""></th>
            <th data-field="">ファイル名</th>
            <th data-field="">カラーパネル</th>
            <th data-field="">表示色番名</th>
            <th data-field="">写真情報</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="image in sortedItemImages" :key="image.id">
            <td>
              <item-thumbnail :width="60" :height="80" :url="image.urlM" />
            </td>
            <td>{{ image.fileName }}</td>
            <td>
              <color-panel
                v-if="image.colorId"
                :color="colorDict[image.colorId].colorPanel"
              />
              <template v-else>-</template>
            </td>
            <td>
              <template v-if="image.colorId">{{
                `${image.colorId} ${colorDict[image.colorId].name}`
              }}</template>
            </td>
            <td>{{ image.caption }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import ColorPanel from '@/components/atoms/colorPanel/ColorPanel'
import { createDict } from '@/utils/dataStructure'

export default {
  name: 'ItemImageTable',
  components: {
    ItemThumbnail,
    ColorPanel,
  },
  props: {
    itemImages: {
      type: Array,
      default: () => [],
    },
    colors: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      openFileSelect: false,
    }
  },
  computed: {
    sortedItemImages() {
      return [...this.itemImages].sort((i1, i2) => i1.sort - i2.sort)
    },
    colorDict() {
      return createDict(this.colors)
    },
  },
}
</script>

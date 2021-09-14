<template>
  <table class="bordered striped">
    <thead>
      <tr>
        <th data-field="">サムネイル</th>
        <th data-field="">商品名</th>
        <th data-field="">事部品番</th>
        <th data-field="">メーカー<br />品番</th>
        <th data-field="">上代</th>
        <th data-field="">販売価格</th>
        <th data-field="">プレビュー</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>
          <item-thumbnail :alt="item.name" :src="item.imageUrl" />
        </td>
        <td><span v-html="item.name"></span></td>
        <td>{{ item.productNumber }}</td>
        <td>{{ item.makerProductNumber }}</td>
        <td>{{ item.retailPrice }}</td>
        <td>{{ item.price }}</td>
        <td>
          <a
            :href="itemPreviewUrl(item.janCode)"
            class="btn waves-effect waves-light lightrn-1"
            target="_blank"
            >プレビュー</a
          >
        </td>
      </tr>
      <NoDataTableRow v-if="items.length === 0" />
    </tbody>
  </table>
</template>

<script>
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'

export default {
  name: 'PastItemList',
  components: {
    ItemThumbnail,
    NoDataTableRow,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      staticPageUrl: '',
    }
  },
  computed: {},
  mounted() {
    this.staticPageUrl = process.env.frontBaseUrl
  },
  methods: {
    itemPreviewUrl(janCode) {
      const previewProductNumber = janCode.substring(0, 8)
      return `${this.staticPageUrl}/items/detail/${previewProductNumber}`
    },
  },
}
</script>

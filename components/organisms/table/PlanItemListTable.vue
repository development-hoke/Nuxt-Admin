<template>
  <table class="bordered striped">
    <thead>
      <tr>
        <th>商品名</th>
        <th>商品番号</th>
        <th>上代</th>
        <th>販売価格</th>
        <th>在庫数</th>
        <th v-if="type === 'edit'">削除</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.productNumber }}</td>
        <td>{{ item.retailPrice }}</td>
        <td>{{ item.discountedPrice }}</td>
        <td>{{ item.ecStock }}</td>
        <td v-if="type === 'edit'">
          <DeleteButton @click="handleClickDelete(item.id)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import DeleteButton from '@/components/atoms/button/DeleteButton'

export default {
  name: 'PlanItemListTable',
  components: {
    DeleteButton,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    planId() {
      return Number(this.$route.params.id)
    },
    plan() {
      return this.$store.getters['plan/find'](this.planId)
    },
  },
  methods: {
    async handleClickDelete(itemId) {
      if (this.deletePending) {
        return
      }

      try {
        this.deletePending = true
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('plan/deleteListItems', {
          id: this.planId,
          itemId,
        })
        this.$toast.success('商品一覧掲載設定を削除しました。')
      } catch (error) {
        console.error(error)
        this.$emit('error', ['削除に失敗しました'])
      } finally {
        this.$store.commit('common/loading', false)
        this.deletePending = false
      }
    },
  },
}
</script>

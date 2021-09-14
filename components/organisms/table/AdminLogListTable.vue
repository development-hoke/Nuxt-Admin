<template>
  <table class="bordered">
    <thead>
      <tr>
        <th>日付</th>
        <th>アカウント名</th>
        <th>IPアドレス</th>
        <th>動作内容</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ dayjs(item.createdAt).format('YYYY/MM/DD HH:mm') }}</td>
        <td>{{ item.staff.name }}</td>
        <td>{{ item.ip }}</td>
        <td>{{ item.actionText }}</td>
      </tr>
      <NoDataTableRow v-if="items.length === 0" />
    </tbody>
  </table>
</template>

<script>
import dayjs from 'dayjs'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'

export default {
  name: 'AdminLogListTable',
  components: {
    NoDataTableRow,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    dayjs(...args) {
      return dayjs(...args)
    },
  },
}
</script>

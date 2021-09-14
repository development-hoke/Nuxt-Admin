<template>
  <table class="bordered striped">
    <thead>
      <tr>
        <th>日時</th>
        <th>タイトル</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(message, index) in messages" :key="index">
        <td>{{ dayjs(message.createdAt).format('YYYY/MM/DD HH:mm') }}</td>
        <td>
          <nuxt-link
            :to="{
              name: 'order-id-messages-message_id',
              params: { id: orderId, message_id: message.id },
            }"
            >{{ message.title }}</nuxt-link
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'OrderMessageListTable',
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
    orderId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    dayjs(...args) {
      return dayjs(...args)
    },
  },
}
</script>

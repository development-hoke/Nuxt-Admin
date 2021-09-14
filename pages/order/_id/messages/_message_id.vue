<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <LargeTitle>メッセージ</LargeTitle>
            <div v-if="!$fetchState.pending" class="section">
              <table class="bordered">
                <tbody>
                  <tr>
                    <td class="bg-blue">タイトル</td>
                    <td>{{ message.title }}</td>
                  </tr>
                  <tr>
                    <td class="bg-blue">日時</td>
                    <td>
                      {{ dayjs(message.createdAt).format('YYYY/MM/DD HH:mm') }}
                    </td>
                  </tr>
                  <tr>
                    <td class="bg-blue">本文</td>
                    <td>
                      <div v-html="message.body"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'

export default {
  name: 'OrderMessageDetail',
  components: {
    Breadcrumb,
    LargeTitle,
  },
  validate({ params }) {
    return /^\d+$/.test(params.message_id)
  },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
  async fetch() {
    const { data } = await this.$api.order.fetchMessage(this.messageId)
    this.message = data
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '受注管理',
          route: { name: 'order' },
        },
        {
          name: '詳細',
          route: { name: 'order-id-detail', params: { id: this.orderId } },
        },
        {
          name: 'メッセージ',
          route: this.$route,
        },
      ],
      message: {},
    }
  },
  computed: {
    messageId() {
      return this.$route.params.message_id
    },
  },
  mounted() {
    this.showLastSuccessMessage()
  },
  methods: {
    dayjs(...args) {
      return dayjs(...args)
    },
    showLastSuccessMessage() {
      const { lastMessage } = this.$store.getters['common/sessionData']

      if (!lastMessage) {
        return
      }

      this.$store.commit('common/clearSessionData', 'lastMessage')

      this.$toast.success(lastMessage)
    },
  },
}
</script>

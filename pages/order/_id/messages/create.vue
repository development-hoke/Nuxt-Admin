<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <LargeTitle>新規メッセージ作成</LargeTitle>
            <div class="section">
              <ValidationObserver
                v-slot="{ handleSubmit }"
                tag="div"
                class="pre-order mb-4"
                :external-errors="serverErrors"
              >
                <div class="row">
                  <div class="col s12">
                    <TextField
                      v-model="inputs.title"
                      name="title"
                      rules="required|max:255"
                      label="タイトル"
                      wrapper-class="input-field inline title-input-field"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <TextareaField
                      v-model="inputs.body"
                      name="body"
                      label="本文"
                      rules="required|max:100000"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ButtonSubmit
                      color="primary"
                      :disabled="$store.getters['common/loading']"
                      @onClick="handleSubmit(handleClickSubmit)"
                      >送信する</ButtonSubmit
                    >
                  </div>
                </div>
                <ErrorMessageList
                  :messages="serverErrors.global"
                  class="mt-2 center-align"
                />
              </ValidationObserver>
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
import TextField from '@/components/molecules/form/TextField'
import TextareaField from '@/components/molecules/form/TextareaField'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import ErrorMessageList from '@/components/organisms/notice/ErrorMessageList'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  name: 'OrderMessageDetail',
  components: {
    Breadcrumb,
    LargeTitle,
    TextField,
    TextareaField,
    ErrorMessageList,
    ButtonSubmit,
  },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
  async fetch() {
    await this.$store.dispatch('order/fetchOne', {
      id: this.orderId,
    })
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
          name: '新規メッセージ作成',
          route: this.$route,
        },
      ],
      inputs: {
        title: null,
        body: null,
      },
      serverErrors: {},
    }
  },
  computed: {
    order() {
      return this.$store.getters['order/find'](this.orderId)
    },
  },
  methods: {
    dayjs(...args) {
      return dayjs(...args)
    },
    async handleClickSubmit() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        this.serverErrors = {}

        const params = { ...this.inputs }

        await this.$store.dispatch('order/sendMessage', {
          orderId: this.orderId,
          params,
        })

        const order = this.order
        const message = order.orderMessages[order.orderMessages.length - 1]

        this.$store.commit('common/setSessionData', {
          lastMessage: 'メッセージを送信しました。',
        })

        this.$router.push({
          name: 'order-id-messages-message_id',
          params: { id: this.orderId, message_id: message.id },
        })
      } catch (error) {
        console.error(error)
        assignErrors(this.serverErrors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.title-input-field {
  width: 600px;
}
</style>

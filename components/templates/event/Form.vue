<template>
  <validation-observer v-slot="{ handleSubmit }" tag="div" class="section">
    <tab-frame :items="tabItems" class="card">
      <template #content="{ activeTabKey }">
        <component
          :is="item.component"
          v-for="item in tabItems"
          :key="item.key"
          class="col s12 tab-content"
          :class="{ active: activeTabKey == item.key }"
          :inputs="inputs"
        />
        <div class="row">
          <div
            v-show="shouldShowSubmitButton(activeTabKey)"
            class="col s6 offset-s3"
          >
            <div class="btn-group">
              <button-submit
                button-class="btn"
                color="primary"
                @onClick="handleSubmit(handleClickSave)"
                >保存</button-submit
              >
              <button-submit
                button-class="btn"
                color="primary"
                @onClick="handleSubmit(handleClickSaveAndClose)"
                >保存して終了</button-submit
              >
              <button-submit
                button-class="btn"
                color="primary"
                @onClick="handleSubmit(handleClickPublish)"
                >公開</button-submit
              >
              <DeleteButton button-long @click="handleClickDelete()" />
            </div>
          </div>
        </div>
      </template>
    </tab-frame>
  </validation-observer>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBasic from '@/components/templates/event/form/Basic'
import EventProducts from '@/components/templates/event/form/Products'
import EventUsers from '@/components/templates/event/form/Users'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import TabFrame from '@/components/organisms/navigation/TabFrame'
import DeleteButton from '@/components/atoms/button/DeleteButton'
import { formEmptyNumber } from '@/utils/format'
import api from '@/api'
import { extractValidationError } from '@/plugins/vee-validate'
import { assignErrors } from '@/plugins/vee-validate'
import * as httpStatusCode from '@/constants/httpStatusCode'

export default {
  components: {
    EventBasic,
    EventProducts,
    EventUsers,
    ButtonSubmit,
    TabFrame,
    DeleteButton,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
    formType: {
      type: String,
      required: true,
    },
    eventId: {
      type: Number,
      default: null,
    },
  },
  async fetch() {
    const { id } = this.$route.params
    const params = this.$route.query
    await this.$store.dispatch('eventItem/fetch', { eventId: id, params })
  },
  data() {
    return {
      errors: {
        global: [],
      },
      serverErrors: {},
      tabItems: [
        {
          key: 'basic',
          title: '基本情報',
          component: 'event-basic',
        },
        {
          key: 'products',
          title: '対象商品と価格設定',
          component: 'event-products',
        },
        {
          key: 'users',
          title: '対象ユーザー',
          component: 'event-users',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      enumKv: 'enum/kv',
    }),
    eventItems() {
      return this.$store.getters['eventItem/data']
    },
    isFormTypeCreate() {
      return this.formType === 'create'
    },
    loading() {
      return this.$store.getters['common/loading']
    },
    discountType() {
      return this.enumKv['event/discountType'] ?? {}
    },
  },
  methods: {
    shouldShowSubmitButton(activeTabKey) {
      return activeTabKey !== 'products'
    },

    buildParams() {
      const params = { ...this.inputs }

      params.discountRate = formEmptyNumber(params.discountRate)
      params.deliveryCondition = formEmptyNumber(params.deliveryCondition)
      params.deliveryPrice = formEmptyNumber(params.deliveryPrice)

      if (Array.isArray(params.eventBundleSales)) {
        params.eventBundleSales = params.eventBundleSales.filter(
          (setting) => setting.count !== null && setting.rate !== null
        )
      }

      return params
    },

    async handleClickSave() {
      try {
        this.$store.commit('common/loading', true)

        const params = this.buildParams()

        await this.updateEvent(params)

        const events = this.$store.getters['event/data']
        const { id } = events[Math.max(events.length - 1, 0)]

        this.$router.push({ name: 'event-edit-id', params: { id } })
      } catch (error) {
        const { product } = extractValidationError(error)
        if (product) {
          this.$toast.error(product[0])
        } else {
          this.$toast.error('イベントの保存に失敗しました。')
        }
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async handleClickSaveAndClose() {
      try {
        this.$store.commit('common/loading', true)

        const params = this.buildParams()

        await this.updateEvent(params)

        this.$router.push({ name: 'event' })
      } catch (error) {
        this.$toast.error('イベントの保存に失敗しました。')
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async handleClickPublish() {
      try {
        this.$store.commit('common/loading', true)

        const params = this.buildParams()

        params.published = true

        await this.updateEvent(params)

        const events = this.$store.getters['event/data']
        const { id } = events[Math.max(events.length - 1, 0)]

        this.$router.push({ name: 'event-edit-id', params: { id } })
      } catch (error) {
        this.$toast.error('イベントの保存に失敗しました。')
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async handleClickDelete() {
      try {
        this.$store.commit('common/loading', true)

        await api.event.delete(this.eventId)
        this.$toast.success('イベントを削除しました。')
        this.$router.push({ name: 'event' })
      } catch (error) {
        if (error.code === httpStatusCode.HTTP_FORBIDDEN) {
          assignErrors(this.serverErrors, error)
          const errorString = this.serverErrors.global || []
          this.$toast.error(...errorString)
        } else {
          this.$toast.error('イベントの削除に失敗しました。')
        }
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async updateEvent(params) {
      this.$store.commit('event/clear')

      if (this.isFormTypeCreate) {
        await this.$store.dispatch('event/create', {
          params,
        })
        this.$toast.success('イベントを追加しました。')
      } else {
        await this.$store.dispatch('event/update', {
          params,
          id: this.eventId,
        })
        this.$toast.success('イベントを更新しました。')
      }
    },
  },
}
</script>

<style scoped>
.card {
  display: flow-root;
}
</style>

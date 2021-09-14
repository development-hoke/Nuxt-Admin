<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <LargeTitle>クーポン</LargeTitle>
            <div class="section">
              <div class="row">
                <div class="col s6 left-align pt-1">
                  <span>クーポン名:</span>
                </div>
                <div class="col s6 right-align mb-2">
                  <ButtonContainer :disabled="loading" @click="handleClickAdd"
                    >追加</ButtonContainer
                  >
                </div>
              </div>
              <div class="row">
                <div class="col s12 select-menu">
                  <InfiniateLoadingSelectField
                    ref="infiniateLoadingSelectField"
                    v-model="inputCouponId"
                    :options="options"
                    @reached-end="handleReachedEnd"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventEmitter from 'events'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import InfiniateLoadingSelectField from '@/components/molecules/form/InfiniateLoadingSelectField'
import { extractValidationError } from '@/plugins/vee-validate'

export default {
  name: 'OrderCancelItem',
  components: {
    Breadcrumb,
    LargeTitle,
    ButtonContainer,
    InfiniateLoadingSelectField,
  },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
  async fetch() {
    const order = await this.$api.order.fetchOne(this.orderId)
    this.order = order.data

    await this.$store.dispatch('memberAvailableCoupons/fetch', {
      memberId: this.order.memberId,
    })

    this.events.emit('feached')
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
          name: 'クーポン',
          route: this.$route,
        },
      ],
      events: new EventEmitter(),
      order: {},
      inputCouponId: null,
    }
  },
  computed: {
    ...mapGetters({
      options: 'memberAvailableCoupons/options',
      isReachedEnd: 'memberAvailableCoupons/isReachedEnd',
      loading: 'common/loading',
    }),
  },
  methods: {
    async handleReachedEnd($state) {
      try {
        if (this.$fetchState.pending) {
          await new Promise((resolve) => this.events.once('feached', resolve))
          $state.loaded()
          return
        }

        await this.$store.dispatch('memberAvailableCoupons/nextPage', {
          memberId: this.order.memberId,
        })

        if (this.isReachedEnd) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } catch (error) {
        console.error(error)
        $state.error()
      }
    },

    async handleClickAdd() {
      if (this.loading) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        const payload = {
          couponId: this.inputCouponId,
        }

        await this.$api.order.addCoupon(this.orderId, payload)

        await this.$store.dispatch('memberAvailableCoupons/fetch', {
          memberId: this.order.memberId,
        })

        this.$refs.infiniateLoadingSelectField.resetLoadingState()

        this.$toast.success('クーポンを追加しました。')
      } catch (error) {
        console.error(error)

        const errors = extractValidationError(error)

        Object.keys(errors).forEach((key) => {
          this.$toast.error(...errors[key])
        })
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.select-menu {
  max-height: 280px;

  &::v-deep .ils-wrapper {
    max-height: 280px;
  }
}
.card-content {
  max-width: 720px;
}
</style>

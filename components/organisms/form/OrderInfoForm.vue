<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    ref="validationObserver"
    class="row"
    tag="div"
    :external-errors="serverErrors"
  >
    <div class="col s6">
      <div class="blank-modify-input"></div>
      <div class="modify-input">
        <ButtonSubmit
          class="order-status-submit"
          @onClick="handleSubmit(haneldClickUpdate)"
          >更新</ButtonSubmit
        >
        <SmallErrorMessageList :messages="serverErrors.global" />
      </div>
      <SelectInput
        ref="input_status"
        v-model="inputs.status"
        name="status"
        wrapper-class="modify-input-1"
        :options="statusOptions"
        valid-name="注文ステータス"
        rules="required"
        :use-unselect-option="false"
      />
      <SelectInput
        ref="input_orderType"
        v-model="inputs.orderType"
        name="orderType"
        wrapper-class="modify-input-1"
        :options="orderTypeOptions"
        valid-name="注文タイプ"
        rules="required"
        :use-unselect-option="false"
      />
      <SelectInput
        ref="input_paymentType"
        v-model="inputs.paymentType"
        name="paymentType"
        wrapper-class="modify-input-1"
        :options="paymentTypeOptions"
        valid-name="入金タイプ"
        rules="required"
        :use-unselect-option="false"
      />
      <SelectInput
        ref="input_deliveryType"
        v-model="inputs.deliveryType"
        name="deliveryType"
        wrapper-class="modify-input-1"
        :options="deliveryTypeOptions"
        valid-name="配送タイプ"
        rules="required"
        :use-unselect-option="false"
      />
      <SelectInput
        ref="input_paid"
        v-model="inputs.paid"
        name="paid"
        wrapper-class="modify-input-1"
        :options="paidOptions"
        valid-name="入金ステータス"
        rules="required"
        :use-unselect-option="false"
      />
    </div>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import SelectInput from '@/components/molecules/form/SelectInput'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import orderLabels from '@/assets/label/order'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  name: 'OrderInfoForm',
  components: {
    SelectInput,
    ButtonSubmit,
    SmallErrorMessageList,
  },
  props: {
    defaultInputs: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inputs: {},
      serverErrors: {},
    }
  },
  computed: {
    ...mapGetters({
      enumOptions: 'enum/options',
    }),
    orderId() {
      return Number(this.$route.params.id)
    },
    order() {
      return this.$store.getters['order/find'](this.orderId)
    },
    statusOptions() {
      return this.enumOptions['order/status'] ?? []
    },
    orderTypeOptions() {
      return this.enumOptions['order/orderType'] ?? []
    },
    paymentTypeOptions() {
      const options = this.enumOptions['order/paymentType'] ?? []
      const acceptablePaymentTypes = this.order
        ? this.order.acceptablePaymentTypes
        : []

      return options.map((option) => ({
        ...option,
        disabled: !acceptablePaymentTypes.includes(option.code),
      }))
    },
    deliveryTypeOptions() {
      return this.enumOptions['order/deliveryType'] ?? []
    },
    deliveryTimeOptions() {
      return this.enumOptions['order/deliveryTime'] ?? []
    },
    paidOptions() {
      const labels = orderLabels.paid
      return Object.keys(labels).map((code) => ({
        code,
        name: labels[code],
      }))
    },
  },
  watch: {
    defaultInputs() {
      this.initializeInputs()
    },
  },
  mounted() {
    this.initializeInputs()
  },
  methods: {
    initializeInputs() {
      this.inputs = Object.assign(
        {
          status: null,
          orderType: null,
          paymentType: null,
          deliveryType: null,
          paid: null,
        },
        this.defaultInputs
      )
    },
    async haneldClickUpdate() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        const params = this.getDirtyFieldValues()

        if (Object.keys(params).length === 0) {
          return
        }

        await this.$store.dispatch('order/update', {
          params,
          id: this.orderId,
        })

        this.initializeInputs()

        this.$refs.validationObserver.reset()

        this.$toast.success('受注ステータスを更新しました。')
      } catch (error) {
        console.error(error)
        this.serverErrors = {}
        assignErrors(this.serverErrors, error)
        this.$toast.error('受注ステータスの更新に失敗しました。')
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    getDirtyFieldValues() {
      return Object.keys(this.$refs).reduce((values, key) => {
        if (key.indexOf('input_') !== 0) {
          return values
        }

        if (!this.$refs[key].isDirty()) {
          return values
        }

        const name = key.split('_')[1]

        values[name] = this.inputs[name]

        return values
      }, {})
    },
  },
}
</script>

<style scoped lang="scss">
.blank-modify-input-right {
  height: 404px;
}
::v-deep .input-field {
  margin: 0 !important;
}
.order-status-submit {
  width: 100%;
}
</style>

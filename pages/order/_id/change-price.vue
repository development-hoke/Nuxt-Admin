<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <LargeTitle>金額</LargeTitle>
            <ValidationObserver
              v-slot="{ handleSubmit }"
              tag="div"
              class="section"
              :external-errors="serverErrors"
            >
              <div class="row">
                <div class="col s1 right-align input-container__label">
                  <span class="input-container__label">変更理由:</span>
                </div>
                <div class="col s5">
                  <TextField
                    v-model="inputs.logMemo"
                    class="input-container__input ml-2"
                    rules="required"
                    valid-name="変更理由"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col s1 right-align input-container__label">
                  <span>変更金額:</span>
                </div>
                <div class="col s5 input-container">
                  <TextField
                    v-model="inputs.priceDiff"
                    class="input-container__input ml-2"
                    type="number"
                    rules="required|integer|is_not:0"
                    valid-name="変更金額"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col s6 right-align">
                  <ButtonContainer @click="handleSubmit(handleClickSubmit)"
                    >追加</ButtonContainer
                  >
                </div>
              </div>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import TextField from '@/components/molecules/form/TextField'
import { extractValidationError } from '@/plugins/vee-validate'

export default {
  name: 'OrderCancelItem',
  components: {
    Breadcrumb,
    LargeTitle,
    ButtonContainer,
    TextField,
  },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
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
          name: '金額',
          route: this.$route,
        },
      ],
      inputs: {
        logMemo: null,
        priceDiff: null,
      },
      serverErrors: {},
    }
  },
  methods: {
    async handleClickSubmit() {
      if (this.$store.getters['common/loading']) {
        return
      }
      try {
        this.$store.commit('common/loading', true)

        const params = { ...this.inputs }

        await this.$store.dispatch('order/updatePrice', {
          params,
          id: this.orderId,
        })

        this.$toast.success('金額を変更しました')
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
.input-container {
  &__input {
    min-width: 300px;
  }

  &__label {
    margin-top: 28px;
  }
}
</style>

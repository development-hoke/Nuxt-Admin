<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <CardPanel>
      <template #title>配送料金設定</template>
      <template #body>
        <ValidationObserver
          v-slot="{ handleSubmit }"
          ref="validationObserver"
          tag="div"
          :external-errors="serverErrors"
        >
          <form class="col s12">
            <div class="row">
              <div class="input-field col s3">
                <text-field
                  type="number"
                  unit="円"
                  input-field-class="form-control"
                  v-model="inputs.deliveryCondition"
                  rules="required|integer|min_value:0"
                  valid-name="配送料割引条件"
                />
              </div>
              <div class="input-field col s2 help-text">
                以上 配送料
              </div>
              <div class="input-field col s3">
                <text-field
                  type="number"
                  unit="円"
                  input-field-class="form-control"
                  v-model="inputs.deliveryPrice"
                  rules="required|integer|min_value:0"
                  valid-name="配送料"
                />
              </div>
            </div>
            <div class="row mb-2">
              <div class="col s12 right-align-md">
                <div class="blank-modify-input"></div>
                <div class="modify-input">
                  <ButtonSubmit
                    class="order-status-submit"
                    @onClick="handleSubmit(haneldClickUpdate)"
                    >更新</ButtonSubmit
                  >
                  <SmallErrorMessageList :messages="serverErrors.global" />
                </div>
              </div>
            </div>
          </form>
        </ValidationObserver>
      </template>
    </CardPanel>
  </div>
</template>

<script>
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import CardPanel from '@/components/molecules/panel/CardPanel'
import TextField from '@/components/molecules/form/TextField'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import api from '@/api/deliverySetting'

const DELIVERY_SETTING_ID = 1

export default {
  components: {
    Breadcrumb,
    CardPanel,
    TextField,
    ButtonSubmit,
    SmallErrorMessageList,
  },
  async asyncData({ store }) {
    const { data } = await api.fetchOne(DELIVERY_SETTING_ID)

    return {
      inputs: {
        deliveryCondition: data.deliveryCondition,
        deliveryPrice: data.deliveryPrice,
      },
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '配送料金設定',
          route: { name: 'delivery-setting' },
        },
      ],
      serverErrors: {},
    }
  },
  methods: {
    async haneldClickUpdate() {
      try {
        this.$store.commit('common/loading', true)
        const { data } = await api.update(DELIVERY_SETTING_ID, this.inputs)
        this.inputs = data
        this.$toast.success('配送料金を更新しました。')
      } catch (error) {
        this.$toast.error('配送料金の更新に失敗しました。')
        console.error(error)
        throw error
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.help-text {
  padding-top: 14px;
}
</style>

<template>
  <validation-observer v-slot="{ handleSubmit }" tag="div">
    <common-modal>
      <template #modal__header>
        対象商品と価格設定
      </template>
      <template #modal__body>
        <text-field
          v-model="inputs.productNumber"
          wrapper-tag="div"
          wrapper-class="input-field-wrap"
          type="text"
          :error-messages="errors.productNumber"
          label="事部品番"
          rules="required"
        />
        <percent-field
          v-model="inputs.discountRate"
          wrapper-tag="div"
          wrapper-class="input-field-wrap"
          type="number"
          :error-messages="errors.discountRate"
          label="割引率"
          rules="required"
        />
      </template>
      <template #modal__footer>
        <div>
          <button-submit
            type="submit"
            button-class="waves-effect waves-light mb-2 btn white-text"
            color="primary"
            @onClick="handleSubmit(handleClickSave)"
          >
            保存
          </button-submit>
          <button
            type="button"
            class="waves-effect waves-light mb-2 btn white-text"
            @click="handleClickCancel"
          >
            キャンセル
          </button>
        </div>
      </template>
    </common-modal>
  </validation-observer>
</template>

<script>
import CommonModal from '@/components/molecules/modal/common'
import TextField from '@/components/molecules/form/TextField'
import PercentField from '@/components/molecules/form/PercentField'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  components: {
    CommonModal,
    TextField,
    PercentField,
    ButtonSubmit,
  },
  data() {
    return {
      inputs: {
        productNumber: '',
        discountRate: null,
      },
      errors: {
        productNumber: [],
        discountRate: [],
        global: [],
      },
    }
  },
  computed: {
    eventId() {
      return this.$route.params.id
    },
  },
  methods: {
    handleClickCancel() {
      this.$emit('close')
    },
    async handleClickSave() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        const params = { ...this.inputs }

        await this.$store.dispatch('eventItem/create', {
          eventId: this.eventId,
          params,
        })

        this.$emit('close')
      } catch (error) {
        this.$toast.error('商品追加に失敗しました。')
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style scoped>
.input-field-wrap {
  width: 90%;
  margin: 0 auto;
}
</style>

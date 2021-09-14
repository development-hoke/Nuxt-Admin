<template>
  <validation-observer
    :key="componentKey"
    v-slot="{ handleSubmit }"
    ref="validationObserver"
    tag="div"
    class="section"
    :external-errors="errors"
  >
    <template>
      <div class="col s12">
        <Basic :inputs="inputs" :form-type="formType" />
      </div>
      <div class="row">
        <div class="col s7 offset-s3">
          <div class="btn-group">
            <delete-button
              v-if="isFormTypeEdit"
              :button-long="true"
              @click="handleClickDelete()"
            />
            <button-submit button-class="btn" color="primary"
              >プレビュー</button-submit
            >
            <button-submit
              button-class="btn"
              color="primary"
              @onClick="handleSubmit(handleClickSave)"
              >保存</button-submit
            >
          </div>
        </div>
        <ErrorMessage v-if="thumbnailRequiredMessage" class="center-align">{{
          thumbnailRequiredMessage
        }}</ErrorMessage>
        <small-error-message-list
          v-show="errors.global.length"
          :messages="errors.global"
        />
      </div>
    </template>
  </validation-observer>
</template>

<script>
import Basic from '@/components/templates/plan/Basic'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import DeleteButton from '@/components/atoms/button/DeleteButton'
import { assignErrors } from '@/plugins/vee-validate'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import * as httpStatusCode from '@/constants/httpStatusCode'

export default {
  components: {
    Basic,
    ButtonSubmit,
    DeleteButton,
    SmallErrorMessageList,
    ErrorMessage,
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
    planId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      errors: {
        global: [],
      },
      serverErrors: {},
      thumbnailRequiredMessage: '',
      componentKey: 0,
    }
  },
  computed: {
    isFormTypeCreate() {
      return this.formType === 'create'
    },
    isFormTypeEdit() {
      return this.formType === 'edit'
    },
    loading() {
      return this.$store.getters['common/loading']
    },
  },
  methods: {
    async handleClickSave() {
      try {
        this.$store.commit('common/loading', true)

        const params = { ...this.inputs }

        if (params.thumbnail === '') {
          this.thumbnailRequiredMessage = 'サムネイル画像は必須です'
          return
        }

        await this.updatePlan(params)

        const plans = this.$store.getters['plan/data']
        const { id } = plans[Math.max(plans.length - 1, 0)]

        this.$router.push({ name: 'plan-edit-id-basic', params: { id } })
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async updatePlan(params) {
      this.$store.commit('plan/clear')

      try {
        if (this.isFormTypeCreate) {
          await this.$store.dispatch('plan/create', {
            params,
          })
          this.$toast.success('企画を追加しました。')
        } else {
          await this.$store.dispatch('plan/update', {
            params,
            id: this.planId,
          })
          this.$toast.success('企画を更新しました。')
        }
      } catch (error) {
        this.$toast.error('企画の保存に失敗しました。')
        console.error(error)
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
        this.componentKey += 1
      }
    },

    async handleClickDelete() {
      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('plan/delete', {
          id: this.planId,
        })
        this.$toast.success('企画を削除しました。')
        this.$router.push({ name: 'plan' })
      } catch (error) {
        if (error.code === httpStatusCode.HTTP_FORBIDDEN) {
          assignErrors(this.serverErrors, error)
          const errorString = this.serverErrors.global || []
          this.$toast.error(...errorString)
        } else {
          this.$toast.error('企画の削除に失敗しました。')
        }
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

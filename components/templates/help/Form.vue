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
        <Basic ref="basic" :inputs="inputs" />
      </div>
      <div class="row">
        <div class="col s7 offset-s3">
          <div class="btn-group">
            <delete-button
              v-if="isFormTypeEdit"
              :button-long="true"
              @click="handleClickDelete()"
            />
            <button-submit
              button-class="btn"
              color="primary"
              @onClick="handleSubmit(handleClickSave)"
              >保存</button-submit
            >
          </div>
        </div>
        <ErrorMessage v-if="helpCategoryRequiredMessage" class="center-align">{{
          helpCategoryRequiredMessage
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
import Basic from '@/components/templates/help/Basic'
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
    helpId: {
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
      helpCategoryRequiredMessage: '',
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

        const helpCategoryId = this.$refs.basic.sendValue()
        this.$set(params, 'helpCategories', helpCategoryId)

        if (!helpCategoryId.length) {
          this.helpCategoryRequiredMessage = 'ヘルプカテゴリは必須です'
          return
        }

        await this.updateHelp(params)

        const help = this.$store.getters['help/data']
        const { id } = help[Math.max(help.length - 1, 0)]

        this.$router.push({ name: 'help-edit-id', params: { id } })
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async updateHelp(params) {
      this.$store.commit('help/clear')

      try {
        if (this.isFormTypeCreate) {
          await this.$store.dispatch('help/create', {
            params,
          })
          this.$toast.success('ヘルプを追加しました。')
        } else {
          await this.$store.dispatch('help/update', {
            params,
            id: this.helpId,
          })
          this.$toast.success('ヘルプを更新しました。')
        }
      } catch (error) {
        this.$toast.error('ヘルプの保存に失敗しました。')
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
        this.componentKey += 1
      }
    },

    async handleClickDelete() {
      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('help/delete', {
          id: this.helpId,
        })
        this.$router.push({ name: 'help' })
        this.$toast.success('ヘルプを削除しました。')
      } catch (error) {
        if (error.code === httpStatusCode.HTTP_FORBIDDEN) {
          assignErrors(this.serverErrors, error)
          const errorString = this.serverErrors.global || []
          this.$toast.error(...errorString)
        } else {
          this.$toast.error('ヘルプの削除に失敗しました。')
        }
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

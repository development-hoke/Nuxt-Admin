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
        <Basic :inputs="inputs" />
      </div>
      <div class="row">
        <div class="col s7 offset-s3">
          <div class="btn-group">
            <delete-button
              v-if="isFormTypeEdit"
              :button-long="true"
              @click="handleClickDelete()"
            />
            <ButtonSubmit
              color="primary"
              @onClick="handleSubmit(() => handleClickPreview())"
              >プレビュー</ButtonSubmit
            >
            <button-submit
              button-class="btn"
              color="primary"
              @onClick="handleSubmit(handleClickSave)"
              >保存</button-submit
            >
          </div>
        </div>
        <small-error-message-list
          v-show="errors.global.length"
          :messages="errors.global"
        />
      </div>
    </template>
  </validation-observer>
</template>

<script>
import querystring from 'querystring'
import Basic from '@/components/templates/information/Basic'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import DeleteButton from '@/components/atoms/button/DeleteButton'
import { assignErrors } from '@/plugins/vee-validate'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import * as httpStatusCode from '@/constants/httpStatusCode'

export default {
  components: {
    Basic,
    ButtonSubmit,
    DeleteButton,
    SmallErrorMessageList,
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
    informationId: {
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
    buildParams() {
      const params = { ...this.inputs }

      params.publishAt = `${params.publishAtDate} ${params.publishAtTime}`

      delete params.publishAtDate
      delete params.publishAtTime

      return params
    },

    async handleClickSave() {
      try {
        this.$store.commit('common/loading', true)

        const params = this.buildParams()

        await this.updateInformation(params)

        const information = this.$store.getters['information/data']
        const { id } = information[Math.max(information.length - 1, 0)]

        this.$router.push({ name: 'information-edit-id', params: { id } })
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async updateInformation(params) {
      this.$store.commit('information/clear')

      try {
        if (this.isFormTypeCreate) {
          await this.$store.dispatch('information/create', {
            params,
          })
          this.$toast.success('お知らせを追加しました。')
        } else {
          await this.$store.dispatch('information/update', {
            params,
            id: this.informationId,
          })
          this.$toast.success('お知らせを更新しました。')
        }
      } catch (error) {
        this.$toast.error('お知らせの保存に失敗しました。')
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

        await this.$store.dispatch('information/delete', {
          id: this.informationId,
        })
        this.$router.push({ name: 'information' })
        this.$toast.success('お知らせを削除しました。')
      } catch (error) {
        if (error.code === httpStatusCode.HTTP_FORBIDDEN) {
          assignErrors(this.serverErrors, error)
          const errorString = this.serverErrors.global || []
          this.$toast.error(...errorString)
        } else {
          this.$toast.error('お知らせの削除に失敗しました。')
        }
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    async handleClickPreview() {
      const token = this.$store.getters['currentUser/accessToken']

      const baseUrl = process.env.frontBaseUrl

      const { key } = await this.storePreview()

      const params = querystring.stringify({ token, key })

      window.open(`${baseUrl}/information/preview/?${params}`, '_blank')
    },
    async storePreview() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.serverErrors = {}

        this.$store.commit('common/loading', true)

        const params = this.buildParams()

        const { data } = await this.$api.information.createPreview(params)

        return data
      } catch (error) {
        console.error(error)
        assignErrors(this.serverErrors, error)
        this.$toast.error('プレビューデータを作成出来ませんでした。')
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

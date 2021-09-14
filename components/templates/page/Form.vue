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
        <small-error-message-list
          v-show="errors.global.length"
          :messages="errors.global"
        />
      </div>
    </template>
  </validation-observer>
</template>

<script>
import Basic from '@/components/templates/page/Basic'
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
    pageId: {
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
    async handleClickSave() {
      try {
        this.$store.commit('common/loading', true)

        const params = { ...this.inputs }

        await this.updatePage(params)

        const page = this.$store.getters['page/data']
        const { id } = page[Math.max(page.length - 1, 0)]

        this.$router.push({ name: 'page-edit-id', params: { id } })
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async updatePage(params) {
      this.$store.commit('page/clear')

      try {
        if (this.isFormTypeCreate) {
          await this.$store.dispatch('page/create', {
            params,
          })
          this.$toast.success('静的ページを追加しました。')
        } else {
          await this.$store.dispatch('page/update', {
            params,
            id: this.pageId,
          })
          this.$toast.success('静的ページを更新しました。')
        }
      } catch (error) {
        this.$toast.error('静的ページの保存に失敗しました。')
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

        await this.$store.dispatch('page/delete', {
          id: this.pageId,
        })
        this.$router.push({ name: 'page' })
        this.$toast.success('静的ページを削除しました。')
      } catch (error) {
        if (error.code === httpStatusCode.HTTP_FORBIDDEN) {
          assignErrors(this.serverErrors, error)
          const errorString = this.serverErrors.global || []
          this.$toast.error(...errorString)
        } else {
          this.$toast.error('静的ページの削除に失敗しました。')
        }
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

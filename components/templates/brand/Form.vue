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
import Basic from '@/components/templates/brand/Basic'
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
    brandId: {
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

        await this.updateBrand(params)

        const brand = this.$store.getters['brand/data']
        const { id } = brand[Math.max(brand.length - 1, 0)]

        this.$router.push({ name: 'master-brand-edit-id', params: { id } })
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async updateBrand(params) {
      this.$store.commit('brand/clear')

      try {
        if (this.isFormTypeCreate) {
          await this.$store.dispatch('brand/create', {
            params,
          })
          this.$toast.success('ブランドを追加しました。')
        } else {
          await this.$store.dispatch('brand/update', {
            params,
            id: this.brandId,
          })
          this.$toast.success('ブランドを更新しました。')
        }
      } catch (error) {
        this.$toast.error('ブランドの保存に失敗しました。')
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

        await this.$store.dispatch('brand/delete', {
          id: this.brandId,
        })
        this.$router.push({ name: 'master-brand' })
        this.$toast.success('ブランドを削除しました。')
      } catch (error) {
        if (error.code === httpStatusCode.HTTP_FORBIDDEN) {
          assignErrors(this.serverErrors, error)
          const errorString = this.serverErrors.global || []
          this.$toast.error(...errorString)
        } else {
          this.$toast.error('ブランドの削除に失敗しました。')
        }
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

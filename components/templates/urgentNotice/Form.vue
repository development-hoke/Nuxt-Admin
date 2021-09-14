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
        <div class="col s5 offset-s3">
          <div class="btn-group">
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
import Basic from '@/components/templates/urgentNotice/Basic'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import { assignErrors } from '@/plugins/vee-validate'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'

export default {
  components: {
    Basic,
    ButtonSubmit,
    SmallErrorMessageList,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
    urgentNoticeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      errors: {
        global: [],
      },
      componentKey: 0,
    }
  },
  computed: {
    loading() {
      return this.$store.getters['common/loading']
    },
  },
  methods: {
    async handleClickSave() {
      try {
        this.$store.commit('common/loading', true)

        const params = { ...this.inputs }

        await this.updateUrgentNotice(params)

        this.$router.push({ name: 'urgent-notice' })
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async updateUrgentNotice(params) {
      this.$store.commit('urgentNotice/clear')
      try {
        await this.$store.dispatch('urgentNotice/update', {
          params,
          id: this.urgentNoticeId,
        })
        this.$toast.success('緊急お知らせを更新しました。')
      } catch (error) {
        this.$toast.error('緊急お知らせの更新に失敗しました。')
        console.error(error)
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
        this.componentKey += 1
      }
    },
  },
}
</script>

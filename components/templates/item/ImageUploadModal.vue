<template>
  <common-modal>
    <template #modal__header>
      商品画像登録
    </template>
    <template #modal__body>
      <image-upload ref="imageUpload" />
    </template>
    <template #modal__footer>
      <div>
        <button-submit
          type="submit"
          button-class="waves-effect waves-light mb-2 btn white-text"
          color="primary"
          @onClick="handleClickUpload"
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
</template>

<script>
import ImageUpload from '@/components/molecules/form/ImageUpload'
import CommonModal from '@/components/molecules/modal/common'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'

export default {
  components: {
    CommonModal,
    ButtonSubmit,
    ImageUpload,
  },
  data() {
    return {}
  },
  computed: {
    itemId() {
      return this.$route.params.id
    },
  },
  methods: {
    handleClickCancel() {
      this.$emit('close')
    },
    async handleClickUpload() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await this.$refs.imageUpload.submitUpload()
      } catch (error) {
        this.$toast.error('商品画像追加に失敗しました。')
      } finally {
        this.$emit('close')
        this.$store.commit('common/loading', false)
        this.$emit('image-update')
      }
    },
  },
}
</script>

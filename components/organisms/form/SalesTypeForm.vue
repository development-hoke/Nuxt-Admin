<template>
  <validation-observer
    v-slot="{ handleSubmit }"
    tag="div"
    :external-errors="serverErrors"
  >
    <modal-template>
      <template slot="header">{{ title }}</template>
      <template slot="body">
        <div class="row">
          <div class="col s3 text-right" style="margin-top: 33px;">
            <label for="name" class="control-label">表示販売タイプ名</label>
          </div>
          <div class="col s5 text-left">
            <TextField
              v-model="inputs.name"
              name="name"
              rules="required|max:255"
              valid-name="表示販売タイプ名"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s3 text-right" style="margin-top: 10px;">
            <label for="name" class="control-label">文字色</label>
          </div>
          <div class="col s9 text-left">
            <color-picker-with-input
              v-model="inputs.textColor"
              rules="color"
              valid-name="文字色"
            />
          </div>
        </div>
      </template>
      <template slot="footer">
        <button-container type="secondary" @click="handleClickCancel"
          >キャンセル</button-container
        >
        <button-container type="primary" @click="handleSubmit(handleClickSave)"
          >保存</button-container
        >
      </template>
    </modal-template>
  </validation-observer>
</template>

<script>
import ModalTemplate from '@/components/organisms/modal/templates/ModalTemplate'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import TextField from '@/components/molecules/form/TextField'
import { assignErrors } from '@/plugins/vee-validate'
import ColorPickerWithInput from '@/components/molecules/input/ColorPickerWithInput'

export const MODE_CREATE = 'create'
export const MODE_EDIT = 'edit'

export default {
  name: 'SalesTypeForm',
  components: {
    ModalTemplate,
    ButtonContainer,
    TextField,
    ColorPickerWithInput,
  },
  props: {
    salesType: {
      type: Object,
      default: null,
    },
    mode: {
      type: String,
      required: true,
      validate(value) {
        return [MODE_CREATE, MODE_EDIT].includes(value)
      },
    },
  },
  data() {
    return {
      inputs: this.salesType ?? {
        id: 0,
        name: null,
        textColor: '#000000',
      },
      serverErrors: {},
    }
  },
  computed: {
    isCreateMode() {
      return this.mode === MODE_CREATE
    },
    title() {
      return this.isCreateMode ? '新しい販売タイプ' : '販売タイプの編集'
    },
  },
  beforeDestroy() {
    this.$store.commit('common/loading', false)
  },
  mounted() {},
  methods: {
    async handleClickSave() {
      if (this.$store.getters['common/loading']) {
        return
      }
      const params = this.inputs
      try {
        this.$store.commit('common/loading', true)

        if (params.id > 0) {
          await this.$store.dispatch('salesType/update', {
            id: params.id,
            params,
          })
          this.$toast.success('販売タイプを更新しました。')
        } else {
          await this.$store.dispatch('salesType/create', { params })
          this.$toast.success('販売タイプを追加しました。')
        }
        this.$emit('cancel')
      } catch (error) {
        this.$toast.error('オンラインタグの保存に失敗しました。')
        console.error(error)
        this.serverErrors = {}
        assignErrors(this.serverErrors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    handleClickCancel() {
      this.$emit('cancel')
    },
  },
}
</script>

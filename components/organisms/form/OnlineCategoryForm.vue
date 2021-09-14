<template>
  <validation-observer
    v-slot="{ handleSubmit }"
    tag="div"
    :external-errors="serverErrors"
  >
    <modal-template>
      <template slot="header">{{ title }}</template>
      <template slot="body">
        <div v-if="parent" class="row">
          <div class="col s12">
            <text-field
              id="parent_id"
              :value="parent.name"
              type="text"
              :disabled="true"
              label="親分類名"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <text-field
              id="id"
              v-model="inputs.id"
              name="id"
              type="text"
              :rules="numberRules"
              :disabled="!isCreateMode"
              label="番号"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <text-field
              id="name"
              v-model="inputs.name"
              name="name"
              type="text"
              rules="required|max:255"
              label="分類名"
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
import { mapGetters } from 'vuex'
import ModalTemplate from '@/components/organisms/modal/templates/ModalTemplate'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import TextField from '@/components/molecules/form/TextField'
import { assignErrors } from '@/plugins/vee-validate'
import { getElementListFromTree } from '@/utils/dataStructure'

export const MODE_CREATE = 'create'
export const MODE_EDIT = 'edit'

export default {
  name: 'OnlineCategoryForm',
  components: {
    ModalTemplate,
    ButtonContainer,
    TextField,
  },
  props: {
    parent: {
      type: Object,
      default: null,
    },
    defaultInputs: {
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
      inputs: this.defaultInputs ?? {
        id: null,
        name: null,
      },
      serverErrors: {},
    }
  },
  computed: {
    isCreateMode() {
      return this.mode === MODE_CREATE
    },
    title() {
      return this.isCreateMode ? 'オンライン分類を追加' : 'オンライン分類を編集'
    },
    ...mapGetters({
      tree: 'onlineCategory/tree',
    }),
    numberRules() {
      const currentId = Number(this.inputs.id)

      const excludeRuleStr = [
        0,
        ...getElementListFromTree(this.tree, 'id').filter(
          (id) => Number(id) !== currentId
        ),
      ].join(',')
      return `required|integer|excluded:${excludeRuleStr}`
    },
  },
  beforeDestroy() {
    this.$store.commit('common/loading', false)
  },
  methods: {
    async handleClickSave() {
      if (this.$store.getters['common/loading']) {
        return
      }
      try {
        this.$store.commit('common/loading', true)

        const params = { ...this.inputs }

        if (this.parent) {
          params.parentId = this.parent.id
        }

        if (this.mode === MODE_CREATE) {
          await this.$store.dispatch('onlineCategory/create', {
            params,
          })
          this.$toast.success('オンライン分類を追加しました。')
        } else {
          await this.$store.dispatch('onlineCategory/update', {
            params,
            id: params.id,
          })
          this.$toast.success('オンライン分類を更新しました。')
        }
        this.$emit('saved')
      } catch (error) {
        this.$toast.error('オンライン分類の更新に失敗しました。')
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

<template>
  <validation-observer
    v-slot="{ handleSubmit }"
    tag="div"
    class="card lighten-4 padding-4"
  >
    <MediumTitle v-if="title" class="center-align">{{ title }}</MediumTitle>
    <div class="row center">
      <div class="col s12">
        事部品番(8桁) :
        <div class="input-field inline">
          <text-field
            v-model="inputs.productNumber"
            :error-messages="errors.productNumber"
            name="productNumber"
            rules="required_if:makerProductNumber,null|max:255"
            width="350"
            :replace-messages="{
              required_if:
                '事部品番(8桁)とメーカー品番(8桁)いずれかの入力が必要です。',
            }"
          />
        </div>
      </div>
    </div>
    <div class="row center">
      <div class="col s12">
        メーカー品番(8桁) :
        <div class="input-field inline">
          <text-field
            v-model="inputs.makerProductNumber"
            :error-messages="errors.makerProductNumber"
            name="makerProductNumber"
            rules="required_if:productNumber,null|max:255"
            class="width-100"
            :replace-messages="{
              required_if:
                '事部品番(8桁)とメーカー品番(8桁)いずれかの入力が必要です。',
            }"
          />
        </div>
      </div>
    </div>
    <div class="row center mt-8">
      <div class="col s12">
        <button-container
          v-if="items.length === 0"
          type="secondary"
          @click="handleClickCancel"
          >キャンセル</button-container
        >
        <button-container
          type="primary"
          @click="handleSubmit(handleClickSearch)"
          >検索</button-container
        >
      </div>
    </div>
    <div
      v-if="errors.global && errors.global.length > 0"
      class="row center-align"
    >
      <div class="col s12 mt-2">
        <error-message v-for="(error, key) in errors.global" :key="key">
          {{ error }}
        </error-message>
      </div>
    </div>
    <div v-if="items.length > 0" class="section">
      <div class="row mt-4 mb-1 center-align">該当商品</div>
      <div class="row item-search-result">
        <div v-for="(item, index) in items" :key="index" class="item">
          <cancel-button @click="handleClickRemoveItem(index)" />
          <item-thumbnail :url="getThumbnailImageUrl(item)" :alt="item.name" />
          <span>{{ item.name }}</span>
          <error-message v-if="excluedItemDict[item.id]"
            >既に使用されています。</error-message
          >
        </div>
      </div>
      <div class="row center mt-2">
        <div class="col s12">
          <button-container type="secondary" @click="handleClickCancel"
            >キャンセル</button-container
          >
          <button-container type="primary" @click="handleClickAdd"
            >追加</button-container
          >
        </div>
        <div class="col s12 mt-2">
          <error-message v-for="(error, key) in errors.add" :key="key">
            {{ error }}
          </error-message>
        </div>
      </div>
    </div>
  </validation-observer>
</template>

<script>
import MediumTitle from '@/components/atoms/title/MediumTitle'
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import CancelButton from '@/components/atoms/button/CancelButton'
import TextField from '@/components/molecules/form/TextField'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import api from '@/api'
import { getThumbnailImageUrl } from '@/utils/prop'
import { isEmptyString } from '@/utils/string'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  name: 'SelectItemInput',
  emits: ['select', 'cancel'],
  components: {
    MediumTitle,
    ItemThumbnail,
    ButtonContainer,
    CancelButton,
    TextField,
    ErrorMessage,
  },
  props: {
    exclueds: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      items: [],
      inputs: {
        productNumber: null,
        makerProductNumber: null,
      },
      errors: {
        global: [],
        add: [],
      },
    }
  },
  computed: {
    excluedItemDict() {
      return this.items
        .filter(({ id }) => this.exclueds.includes(id))
        .reduce((dict, item) => Object.assign(dict, { [item.id]: item }), {})
    },
  },
  methods: {
    getThumbnailImageUrl(...args) {
      return getThumbnailImageUrl(...args)
    },

    async handleClickSearch() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.resetErrors()

        this.$store.commit('common/loading', true)

        const { productNumber, makerProductNumber } = this.inputs

        const params = {}

        if (!isEmptyString(productNumber)) {
          params.productNumber = [productNumber]
        }

        if (!isEmptyString(makerProductNumber)) {
          params.makerProductNumber = [makerProductNumber]
        }

        const { data } = await api.item.fetch(params)

        this.items = data

        if (this.items.length === 0) {
          this.$set(this.errors, 'global', ['商品が見つかりませんでした。'])
        }
      } catch (error) {
        console.error(error)
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    resetErrors() {
      Object.keys(this.errors).forEach((rule) =>
        this.$set(this.errors, rule, [])
      )
    },

    handleClickRemoveItem(index) {
      this.items.splice(index, 1)
    },

    handleClickAdd() {
      if (Object.keys(this.excluedItemDict).length > 0) {
        this.$set(this.errors, 'add', [
          '既に使用されている商品が含まれています。',
        ])
        return
      }

      if (this.items.length === 0) {
        this.$set(this.errors, 'add', ['一つ以上の商品を選択してください。'])
        return
      }

      this.$emit('select', this.items)
    },

    handleClickCancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped lang="scss">
.card {
  display: flow-root;

  .item-search-result {
    min-height: 136px;

    .item {
      margin: 0 auto;
      max-width: 80px;

      img {
        margin: 0;
      }

      &::v-deep .error {
        white-space: break-spaces;
      }
    }
  }
  .input-field {
    min-width: 350px;
    min-height: 80px;
  }
}
</style>

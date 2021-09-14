<template>
  <validation-observer
    v-slot="{ handleSubmit }"
    tag="div"
    :external-errors="serverErrors"
  >
    <modal-template>
      <template slot="header">闇市設定</template>
      <template slot="body">
        <div class="row">
          <div class="col s12">
            <label>タイトル</label>
            <TextField
              v-model="inputs.title"
              name="title"
              type="text"
              rules="required|max:255"
              valid-name="タイトル"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <label>パスワード</label>
            <TextField
              v-model="inputs.password"
              name="password"
              type="text"
              rules="required|alpha_dash|min:6|max:255"
              valid-name="パスワード"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <label>有効期限</label>
            <DateitemPickerField
              v-model="inputs.limitAt"
              name="limitAt"
              rules="required|date_required"
              :clear-button="false"
              valid-name="有効期限"
              input-field-class="input-field"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s4">
            <label>色番</label>
            <SelectInput
              v-model="inputs.colorId"
              :options="colorOptions"
              name="colorId"
              type="text"
              :rules="{
                required: true,
                integer: true,
                oneOf: availableColorIds,
              }"
              valid-name="色番"
              :allow-select-unselect-option="true"
            />
          </div>
          <div class="col s4">
            <label>サイズ番</label>
            <SelectInput
              v-model="inputs.sizeId"
              :options="sizeOptions"
              name="sizeId"
              type="text"
              :rules="{
                required: true,
                integer: true,
                oneOf: availableSizeIds,
              }"
              valid-name="サイズ番"
              :allow-select-unselect-option="true"
            />
          </div>
          <div class="col s4">
            <label>個数</label>
            <TextField
              v-model="inputs.num"
              name="num"
              type="number"
              :rules="{
                required: true,
                integer: true,
              }"
              valid-name="個数"
            />
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="row">
          <div class="col s12">
            <button-container type="secondary" @click="handleClickCancel"
              >キャンセル</button-container
            >
            <button-container
              type="primary"
              @click="handleSubmit(handleClickSave)"
              >発行する</button-container
            >
          </div>
        </div>
        <SmallErrorMessageList :messages="serverErrors.global" />
      </template>
    </modal-template>
  </validation-observer>
</template>

<script>
import ModalTemplate from '@/components/organisms/modal/templates/ModalTemplate'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import TextField from '@/components/molecules/form/TextField'
import SelectInput from '@/components/molecules/form/SelectInput'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import DateitemPickerField from '@/components/molecules/form/DateitemPickerField'
import { assignErrors } from '@/plugins/vee-validate'
import { unique } from '@/utils/array'

export default {
  name: 'ClosedMarketForm',
  components: {
    ModalTemplate,
    ButtonContainer,
    DateitemPickerField,
    TextField,
    SelectInput,
    SmallErrorMessageList,
  },
  props: {
    itemId: {
      type: Number,
      required: true,
    },
    itemDetails: {
      type: Array,
      default: () => [],
    },
    defaultInputs: {
      type: Object,
      default: () => ({}),
    },
    closedMarketId: {
      type: Number,
      default: null,
    },
  },
  data() {
    const inputs = Object.assign(
      {
        title: null,
        password: null,
        colorId: null,
        limitAt: null,
        sizeId: null,
        num: null,
      },
      this.defaultInputs
    )

    return {
      inputs,
      serverErrors: {},
      isEdit: this.closedMarketId !== null,
      assinedStock: this.defaultInputs.stock || 0,
      assinedItemDetailId: this.defaultInputs.itemDetailId
        ? Number(this.defaultInputs.itemDetailId)
        : null,
    }
  },
  computed: {
    colorOptions() {
      const formatted = this.itemDetails.map(({ color }) => ({
        code: color.id,
        name: color.name,
      }))

      const options = unique(formatted, 'code')

      if (this.availableColorIds.length === this.itemDetails.length) {
        return options
      }

      return options.filter(({ code }) => this.availableColorIds.includes(code))
    },
    sizeOptions() {
      const formatted = this.itemDetails.map(({ size }) => ({
        code: size.id,
        name: size.name,
      }))

      const options = unique(formatted, 'code')

      if (this.availableSizeIds.length === this.itemDetails.length) {
        return options
      }

      return options.filter(({ code }) => this.availableSizeIds.includes(code))
    },
    filteredItemDetails() {
      return this.itemDetails
        .map((itemDetail) => {
          return {
            ...itemDetail,
            assinableStock:
              Number(itemDetail.id) === this.assinedItemDetailId
                ? itemDetail.ecStock + this.assinedStock
                : itemDetail.ecStock,
          }
        })
        .filter(({ assinableStock }) => assinableStock > 0)
    },
    availableColorIds() {
      if (this.inputs.sizeId === null) {
        return this.filteredItemDetails.map(({ colorId }) => colorId)
      }
      return this.filteredItemDetails
        .filter(({ sizeId }) => Number(sizeId) === Number(this.inputs.sizeId))
        .map(({ colorId }) => colorId)
    },
    availableSizeIds() {
      if (this.inputs.colorId === null) {
        return this.filteredItemDetails.map(({ sizeId }) => sizeId)
      }
      return this.filteredItemDetails
        .filter(
          ({ colorId }) => Number(colorId) === Number(this.inputs.colorId)
        )
        .map(({ sizeId }) => sizeId)
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

        if (this.isEdit) {
          await this.$store.dispatch('closedMarket/update', {
            params,
            itemId: this.itemId,
            id: this.closedMarketId,
          })
        } else {
          await this.$store.dispatch('closedMarket/create', {
            params,
            itemId: this.itemId,
          })
        }
        this.$emit('saved')
      } catch (error) {
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

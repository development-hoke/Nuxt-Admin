<template>
  <ValidationObserver
    ref="validationObserver"
    v-slot="{ handleSubmit }"
    tag="div"
    :external-errors="serverErrors"
  >
    <ButtonSubmit @onClick="handleSubmit(haneldClickUpdate)">更新</ButtonSubmit>
    <SmallErrorMessageList :messages="serverErrors.global" />
    <div class="modify-input first-modify-input">
      <div class="row">
        <div class="col s6 pl-4">
          <TextField
            ref="inputs.deliveryAddress.lname"
            v-model="inputs.deliveryAddress.lname"
            name="deliveryAddress.lname"
            rules="max:255|required"
            valid-name="お客様氏名（姓）"
            input-field-class="input-field m-0"
          />
        </div>
        <div class="col s6 pr-4">
          <TextField
            ref="inputs.deliveryAddress.fname"
            v-model="inputs.deliveryAddress.fname"
            name="deliveryAddress.fname"
            rules="max:255|required"
            valid-name="お客様氏名（名）"
            input-field-class="input-field m-0"
          />
        </div>
      </div>
    </div>
    <div class="modify-input">
      <div class="row">
        <div class="col s6 pl-4">
          <TextField
            ref="inputs.deliveryAddress.lkana"
            v-model="inputs.deliveryAddress.lkana"
            name="deliveryAddress.lkana"
            rules="kana|max:255|required"
            valid-name="お客様氏名（セイ）"
            input-field-class="input-field m-0 inline"
          />
        </div>
        <div class="col s6 pr-4">
          <TextField
            ref="inputs.deliveryAddress.fkana"
            v-model="inputs.deliveryAddress.fkana"
            name="deliveryAddress.fkana"
            rules="kana|max:255|required"
            valid-name="お客様氏名（メイ）"
            input-field-class="input-field m-0 inline"
          />
        </div>
      </div>
    </div>
    <div class="modify-input">
      <TextField
        ref="inputs.deliveryAddress.zip"
        v-model="inputs.deliveryAddress.zip"
        name="deliveryAddress.zip"
        rules="max:8|required"
        valid-name="郵便番号"
        input-field-class="input-field m-0"
      />
    </div>
    <div class="modify-input">
      <SelectInput
        ref="inputs.deliveryAddress.prefId"
        v-model="inputs.deliveryAddress.prefId"
        :options="prefOptions"
        name="deliveryAddress.prefId"
        rules="required"
        valid-name="都道府県"
        input-field-class="input-field m-0"
      />
    </div>
    <div class="modify-input">
      <TextField
        ref="inputs.deliveryAddress.city"
        v-model="inputs.deliveryAddress.city"
        name="deliveryAddress.city"
        rules="max:50|required"
        valid-name="市区町村"
        input-field-class="input-field m-0"
      />
    </div>
    <div class="modify-input">
      <TextField
        ref="inputs.deliveryAddress.town"
        v-model="inputs.deliveryAddress.town"
        name="deliveryAddress.town"
        rules="max:50|required"
        valid-name="町名"
        input-field-class="input-field m-0"
      />
    </div>
    <div class="modify-input">
      <TextField
        ref="inputs.deliveryAddress.address"
        v-model="inputs.deliveryAddress.address"
        name="deliveryAddress.address"
        rules="max:100|required"
        valid-name="丁番地"
        input-field-class="input-field m-0"
      />
    </div>
    <div class="modify-input">
      <TextField
        ref="inputs.deliveryAddress.building"
        v-model="inputs.deliveryAddress.building"
        name="deliveryAddress.building"
        rules="max:100"
        valid-name="建物"
        input-field-class="input-field m-0"
      />
    </div>
    <div class="modify-input">
      <TextField
        ref="inputs.deliveryAddress.tel"
        v-model="inputs.deliveryAddress.tel"
        name="deliveryAddress.tel"
        rules="max:50"
        valid-name="連絡先"
        input-field-class="input-field m-0"
      />
    </div>
  </ValidationObserver>
</template>

<script>
import merge from 'lodash.merge'
import TextField from '@/components/molecules/form/TextField'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import SelectInput from '@/components/molecules/form/SelectInput'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  name: 'OrderDeliveryInfoForm',
  components: {
    TextField,
    ButtonSubmit,
    SelectInput,
    SmallErrorMessageList,
  },
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    prefOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      inputs: {
        deliveryNumber: null,
        deliveryAddress: {
          lname: null,
          fname: null,
          lkana: null,
          fkana: null,
          zip: null,
          prefId: null,
          city: null,
          town: null,
          address: null,
          building: null,
          tel: null,
        },
      },
      serverErrors: {},
    }
  },
  mounted() {
    this.initializeInputs()
  },
  methods: {
    async haneldClickUpdate() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        this.serverErrors = {}

        const params = this.getDirtyFieldValues()

        if (Object.keys(params).length === 0) {
          return
        }

        await this.$store.dispatch('order/update', {
          params,
          id: this.order.id,
        })

        this.initializeInputs()

        this.$refs.validationObserver.reset()

        this.$toast.success('発送先情報を更新しました。')
      } catch (error) {
        console.error(error)
        this.serverErrors = {}
        assignErrors(this.serverErrors, error)
        this.$toast.error('発送先情報の更新に失敗しました。')
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    getDirtyFieldValues() {
      return Object.keys(this.$refs).reduce((values, key) => {
        if (key.indexOf('inputs.') !== 0) {
          return values
        }

        if (!this.$refs[key].isDirty()) {
          return values
        }

        const tokens = key.split('.').slice(1)

        const param = this.constructRequestParam(tokens, this.inputs)

        return merge(values, param)
      }, {})
    },

    constructRequestParam(tokens, inputs) {
      if (tokens.length > 1) {
        return {
          [tokens[0]]: this.constructRequestParam(
            tokens.slice(1),
            inputs[tokens[0]]
          ),
        }
      }

      return { [tokens[0]]: inputs[tokens[0]] }
    },

    initializeInputs() {
      const inputs = {}
      const { deliveryNumber, deliveryAddress } = this.order

      inputs.deliveryNumber = deliveryNumber
      inputs.deliveryAddress = {}
      inputs.deliveryAddress.lname = deliveryAddress.lname
      inputs.deliveryAddress.fname = deliveryAddress.fname
      inputs.deliveryAddress.lkana = deliveryAddress.lkana
      inputs.deliveryAddress.fkana = deliveryAddress.fkana
      inputs.deliveryAddress.zip = deliveryAddress.zip
      inputs.deliveryAddress.prefId = deliveryAddress.prefId
      inputs.deliveryAddress.city = deliveryAddress.city
      inputs.deliveryAddress.town = deliveryAddress.town
      inputs.deliveryAddress.address = deliveryAddress.address
      inputs.deliveryAddress.building = deliveryAddress.building
      inputs.deliveryAddress.tel = deliveryAddress.tel

      this.inputs = inputs
    },
  },
}
</script>

<style lang="scss" scoped>
.modify-input {
  margin-top: 1.5px;

  &.first-modify-input {
    margin-top: 78px;
  }
}
::v-deep select {
  text-align: center;
  text-align-last: center;
}
</style>

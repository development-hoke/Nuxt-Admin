<template>
  <validation-observer v-slot="{ handleSubmit }" tag="tr">
    <td>
      <img
        v-if="eventItem.item.itemImages.length > 0"
        :src="eventItem.item.itemImages[0].urlM"
        width="60"
      />
    </td>
    <td>{{ eventItem.item.name }}</td>
    <td>
      <template v-if="editing">
        <text-field
          v-model="editingValues.productNumber"
          wrapper-tag="div"
          wrapper-class="input-field-wrap"
          type="text"
          :error-messages="errors.productNumber"
          rules="required"
          valid-name="商品番号"
        />
      </template>
      <template v-else>
        {{ eventItem.item.productNumber }}
      </template>
    </td>
    <td>{{ yen(eventItem.item.retailPrice) }}</td>
    <td>
      <template v-if="event">
        <template v-if="editing && !isDiscountFlat">
          <percent-field
            v-model="editingValues.discountRate"
            wrapper-tag="div"
            wrapper-class="input-field-wrap"
            type="number"
            :error-messages="errors.discountRate"
            unit="%"
            rules="required"
            valid-name="イベント値引率"
          />
        </template>
        <template v-else>
          {{
            percentile(
              isDiscountFlat ? event.discountRate : eventItem.discountRate
            )
          }}
        </template>
      </template>
    </td>
    <td>{{ eventItem.item.ecStock }}</td>
    <td>
      <template v-if="editing">
        <a href="" @click.prevent="handleClickCancel"
          ><i class="material-icons">cancel</i></a
        >
        <a href="" @click.prevent="handleSubmit(handleClickSave)"
          ><i class="material-icons">save</i></a
        >
        <small-error-message-list
          v-show="errors.global.length"
          :messages="errors.global"
        />
      </template>
      <template v-else>
        <a href="" @click.prevent="handleClickEdit"
          ><i class="material-icons">edit</i></a
        >
        <DeleteButton
          title="商品削除"
          body="商品を削除します。よろしいですか？"
          :delete-forever-icon="true"
          @click="handleClickDelete()"
        />
      </template>
    </td>
  </validation-observer>
</template>

<script>
import EventEmitter from 'events'
import TextField from '@/components/molecules/form/TextField'
import PercentField from '@/components/molecules/form/PercentField'
import { yen, percentile } from '@/utils/format'
import { assignErrors } from '@/plugins/vee-validate'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import DeleteButton from '@/components/atoms/button/DeleteButton'

export default {
  name: 'EventProductItem',
  components: {
    TextField,
    PercentField,
    SmallErrorMessageList,
    DeleteButton,
  },
  props: {
    eventItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      yen,
      percentile,
      events: new EventEmitter(),
      editing: false,
      editingValues: {},
      errors: {
        productNumber: [],
        discountRate: [],
        global: [],
      },
      pending: false,
    }
  },
  computed: {
    eventId() {
      return this.$route.params.id
    },
    event() {
      return this.$store.getters['event/find'](this.eventId)
    },
    discountType() {
      return this.$store.getters['enum/kv']['event/discountType'] || {}
    },
    isDiscountFlat() {
      return Number(this.event.discountType) === Number(this.discountType.flat)
    },
  },
  methods: {
    handleClickEdit() {
      this.editing = true
      this.editingValues = {
        productNumber: this.eventItem.item.productNumber,
        discountRate: this.eventItem.discountRate,
      }
    },

    handleClickCancel() {
      this.editing = false
      this.editingValues = {}
      Object.keys(this.errors).forEach((field) => {
        this.$set(this.errors, field, [])
      })
    },

    async handleClickSave() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        const params = { ...this.editingValues }

        await this.$store.dispatch('eventItem/update', {
          id: this.eventItem.id,
          eventId: this.eventId,
          params,
        })
        this.$toast.success('対象商品と価格設定を更新しました。')
        this.editing = false
        this.editingValues = {}
      } catch (error) {
        this.$toast.error('対象商品と価格設定の更新に失敗しました。')
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async handleClickDelete() {
      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('eventItem/delete', {
          id: this.eventItem.id,
          eventId: this.eventId,
        })
        this.$toast.success('対象商品と価格設定を削除しました。')
      } catch (error) {
        this.$toast.error('対象商品と価格設定の削除に失敗しました。')
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style scoped>
.input-field-wrap {
  max-width: 184px;
  margin: 0 auto;
}
.input-field-wrap >>> .input-field {
  margin-top: 0;
  margin-bottom: 0;
}
</style>

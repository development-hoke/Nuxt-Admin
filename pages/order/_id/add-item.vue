<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <LargeTitle>商品追加</LargeTitle>
            <div class="section">
              <div class="row">
                <ValidationObserver
                  v-slot="{ handleSubmit }"
                  tag="div"
                  class="col s12 search-box center"
                >
                  <TextField
                    v-model="inputs.departmentId"
                    name="departmentId"
                    :error-messages="errors.departmentId"
                    label="部門番号"
                    input-field-class="input-field inline"
                    rules="required_if:makerProductNumber,null|integer"
                  />
                  <TextField
                    v-model="inputs.makerProductNumber"
                    name="makerProductNumber"
                    :error-messages="errors.makerProductNumber"
                    label="メーカー品番"
                    input-field-class="input-field inline"
                    rules="required_if:departmentId,null|max:255"
                  />
                  <ButtonContainer
                    class="mt-2 ml-2"
                    @click="handleSubmit(handleClickSearch)"
                    >検索</ButtonContainer
                  >
                </ValidationObserver>
                <SmallErrorMessageList
                  class="col s12"
                  :messages="serverErrors.global"
                />
              </div>
            </div>
            <div class="section">
              <OrderDetailListTable
                v-model="checkedItemIndices"
                :items="formattedItems"
                :show-checkbox="true"
                :show-agg="false"
              >
                <template #control>追加</template>
              </OrderDetailListTable>
              <Loading :show="$store.getters['common/onlyPending']" />
              <div class="row">
                <div class="col s12 right-align mt-2">
                  <ButtonContainer
                    :disabled="checkedItemIndices.length === 0"
                    @click="handleClickAdd"
                    >追加</ButtonContainer
                  >
                </div>
              </div>
            </div>
            <div class="section">
              <div class="row">
                <div class="col s12 pagination">
                  <pagination
                    :total-count="pagination.total"
                    :current-page="pagination.currentPage"
                    :per-page="pagination.perPage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import TextField from '@/components/molecules/form/TextField'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import OrderDetailListTable from '@/components/organisms/table/OrderDetailListTable'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import Pagination from '@/components/molecules/pagination/Pagination'
import {
  getThumbnailData,
  getColorAndSize,
  getRootCategoryGroup,
  ORDER_DETAIL_TYPE_ITEM,
} from '@/store/orderAggregation'
import { assignErrors, extractValidationError } from '@/plugins/vee-validate'
import { isEmptyString } from '@/utils/string'

export default {
  name: 'OrderAddItem',
  components: {
    Breadcrumb,
    LargeTitle,
    TextField,
    ButtonContainer,
    OrderDetailListTable,
    SmallErrorMessageList,
    Pagination,
  },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '受注管理',
          route: { name: 'order' },
        },
        {
          name: '詳細',
          route: { name: 'order-id-detail', params: { id: this.orderId } },
        },
        {
          name: '商品追加',
          route: this.$route,
        },
      ],
      inputs: {
        departmentId: null,
        makerProductNumber: null,
      },
      serverErrors: {},
      checkedItemIndices: [],
      currentTableConditions: {},
      errors: {},
    }
  },
  computed: {
    items() {
      return this.$store.getters['orderItem/data']
    },
    pagination() {
      return this.$store.getters['orderItem/pagination']
    },
    formattedItems() {
      return this.items.reduce((formatted, item) => {
        const created = item.itemDetails.map(function (itemDetail) {
          const [imageUrl, imageAlt] = getThumbnailData(item)

          return {
            params: {
              itemDetailId: itemDetail.id,
              price: item.priceBeforeOrder,
            },
            imageUrl,
            imageAlt,
            title: item.departmentId,
            makerProductNumber: item.makerProductNumber,
            departmentName: item.department.name,
            rootCategories: getRootCategoryGroup(item),
            itemName: item.name,
            colorAndSize: getColorAndSize(itemDetail),
            price: item.priceBeforeOrder,
            amount: 1,
            type: ORDER_DETAIL_TYPE_ITEM,
          }
        })

        return formatted.concat(created)
      }, [])
    },
  },
  beforeMount() {
    this.$store.commit('orderItem/clear')
  },
  methods: {
    async handleClickSearch() {
      if (this.$store.getters['common/pending']) {
        return
      }
      try {
        this.resetErrors()

        const { departmentId, makerProductNumber } = this.inputs

        let type

        if (!isEmptyString(departmentId)) {
          type = 'departmentId'
        }

        if (!isEmptyString(makerProductNumber)) {
          type = 'makerProductNumber'
        }

        this.$store.commit('common/pending', true)

        this.checkedItemIndices = []
        this.serverErrors = {}

        const params = {
          [type]: this.inputs[type],
          orderId: this.orderId,
        }

        await this.$store.dispatch('orderItem/fetch', {
          id: this.orderId,
          params,
        })

        this.currentTableConditions = params
      } catch (error) {
        console.error(error)
        assignErrors(this.serverErrors, error)
      } finally {
        this.$store.commit('common/pending', false)
      }
    },

    async handleClickAdd() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        this.serverErrors = {}

        const items = this.checkedItemIndices.map((index) => {
          const { params, amount } = this.formattedItems[index]
          return {
            ...params,
            amount,
          }
        })

        await this.$store.dispatch('orderDetail/create', {
          orderId: this.orderId,
          params: { items },
        })

        this.$toast.success('商品を追加しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const message = errors[Object.keys(errors)[0]]
        this.$toast.error(Array.isArray(message) ? message[0] : message)
      } finally {
        this.$store.commit('common/loading', false)
      }

      try {
        await this.$store.dispatch('orderItem/fetch', {
          id: this.orderId,
          params: this.currentTableConditions,
        })

        this.checkedItemIndices = []
      } catch (error) {
        this.$set(this.serverErrors, 'global', ['画面を更新できませんでした。'])
      }
    },

    resetErrors() {
      Object.keys(this.errors).forEach((rule) =>
        this.$set(this.errors, rule, [])
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
}
</style>

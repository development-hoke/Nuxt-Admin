<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <event-form :inputs="inputs" form-type="create" />
      </div>
    </div>
  </div>
</template>

<script>
import 'vue2-timepicker/dist/VueTimepicker.css'
import EventForm from '@/components/templates/event/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import { createNewItem } from '@/components/templates/event/form/basic/BundleInfo'

export default {
  components: {
    EventForm,
    Breadcrumb,
  },
  async fetch({ store }) {
    await Promise.all([store.dispatch('enum/fetch')])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'イベント管理',
          route: { name: 'event' },
        },
        {
          name: '新規作成',
          route: { name: 'event-create' },
        },
      ],
      inputs: {},
    }
  },
  computed: {
    defaultTarget() {
      return this.$store.getters['enum/kv']['event/target']?.employee
    },
    defaultSaleType() {
      return this.$store.getters['enum/kv']['event/saleType']?.normal
    },
    defaultDiscountType() {
      return this.$store.getters['enum/kv']['event/discountType']?.flat
    },
    defaultTargetUserType() {
      return this.$store.getters['enum/kv']['event/targetUserType']?.all
    },
  },
  created() {
    this.inputs = {
      title: '',
      periodFromDate: null,
      periodFromTime: null,
      periodToDate: null,
      periodToTime: null,
      target: this.defaultTarget,
      discountType: this.defaultDiscountType,
      discountRate: null,
      saleType: this.defaultSaleType,
      eventBundleSales: [createNewItem()],
      isDeliverySetting: false,
      deliveryCondition: null,
      deliveryPrice: null,
      published: false,
      targetUserType: this.defaultTargetUserType,
    }
  },
}
</script>

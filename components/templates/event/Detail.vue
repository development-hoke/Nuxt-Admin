<template>
  <div class="section">
    <tab-frame :items="tabItems">
      <template #content="{ activeTabKey }">
        <component
          :is="item.component"
          v-for="item in tabItems"
          :key="item.key"
          class="tab-content"
          :class="{ active: activeTabKey == item.key }"
          :event="event"
        />
      </template>
    </tab-frame>
  </div>
</template>

<script>
import EventBasic from '@/components/templates/event/detail/Basic'
import EventProducts from '@/components/templates/event/detail/Products'
import EventUsers from '@/components/templates/event/detail/Users'
import TabFrame from '@/components/organisms/navigation/TabFrame'

export default {
  components: {
    EventBasic,
    EventProducts,
    EventUsers,
    TabFrame,
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tabItems: [
        {
          key: 'basic',
          title: '基本情報',
          component: 'event-basic',
        },
        {
          key: 'products',
          title: '対象商品と価格設定',
          component: 'event-products',
        },
        {
          key: 'users',
          title: '対象ユーザー',
          component: 'event-users',
        },
      ],
      errorMessage: '',
    }
  },
}
</script>

<style scoped>
.card {
  display: flow-root;
}
</style>

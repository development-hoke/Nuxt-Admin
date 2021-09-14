<template>
  <nuxt-child :order-id="orderId" />
</template>

<script>
import { getCleanPath } from '@/utils/routing'

export default {
  name: 'OrderId',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  middleware({ redirect, route }) {
    if (route.name === 'order-id') {
      const path = getCleanPath(route.path)
      return redirect(`${path}/detail`)
    }
  },
  computed: {
    orderId() {
      return Number(this.$route.params.id)
    },
  },
}
</script>

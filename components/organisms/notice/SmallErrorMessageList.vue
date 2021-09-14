<template>
  <div v-if="messages.length > 0" class="error">
    <small-error-message v-for="(message, index) in messages" :key="index">
      {{ message }}
    </small-error-message>
  </div>
</template>

<script>
import SmallErrorMessage from '@/components/atoms/notice/SmallErrorMessage'

export default {
  name: 'SmallErrorMessageList',
  components: {
    SmallErrorMessage,
  },
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

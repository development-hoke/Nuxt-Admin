<template>
  <div v-if="messages.length > 0" class="error mt-1">
    <ErrorMessage v-for="(message, index) in messages" :key="index">
      {{ message }}
    </ErrorMessage>
  </div>
</template>

<script>
import ErrorMessage from '@/components/atoms/notice/ErrorMessage'

export default {
  name: 'ErrorMessageList',
  components: {
    ErrorMessage,
  },
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

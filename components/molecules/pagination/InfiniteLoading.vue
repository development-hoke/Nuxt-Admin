<template>
  <InfiniteLoadingExtra
    :identifier="identifier"
    :direction="direction"
    @infinite="($state) => $emit('reached-end', $state)"
  >
    <template #no-results>{{ '' }}</template>
    <template #no-more>{{ '' }}</template>
    <template #error
      >エラーが発生しました。<ButtonContainer
        type="secondary"
        @click="resetLoadingState"
      >
        再読み込み
      </ButtonContainer></template
    >
  </InfiniteLoadingExtra>
</template>

<script>
import InfiniteLoadingExtra from '@/components/atoms/InfiniteLoadingExtra'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'

export default {
  name: 'InfiniteLoading',
  emits: ['reached-end'],
  components: {
    InfiniteLoadingExtra,
    ButtonContainer,
  },
  props: {
    direction: {
      type: String,
      default: 'bottom',
      validate(value) {
        return ['top', 'bottom', 'right', 'left'].includes(value)
      },
    },
  },
  data() {
    return {
      identifier: 1,
    }
  },
  methods: {
    resetLoadingState() {
      // この値が更新されるとローディングがリセットされる
      this.identifier++
    },
  },
}
</script>

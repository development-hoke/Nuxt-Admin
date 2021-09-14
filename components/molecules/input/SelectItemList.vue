<template>
  <div class="row mb-2">
    <div class="col s1"></div>
    <div class="col s10 s-list">
      <div v-for="(item, index) in items" :key="index" class="s-item">
        <slot name="item" :item="item" :index="index"></slot>
      </div>
      <InfiniteLoading
        v-if="useInifiniateLoading"
        ref="infiniteLoading"
        tag="div"
        direction="right"
        @reached-end="handleReachedEnd"
      />
    </div>
    <div v-if="showAddButton" class="col s12 mt-2 mb-2 center-align">
      <medium-add-button @click="$emit('add')">
        <slot name="buttonText">追加</slot>
      </medium-add-button>
    </div>
  </div>
</template>

<script>
import MediumAddButton from '@/components/atoms/button/MediumAddButton'
import InfiniteLoading from '@/components/molecules/pagination/InfiniteLoading'

export default {
  name: 'SelectItemList',
  emits: ['add', 'reached-end'],
  components: {
    MediumAddButton,
    InfiniteLoading,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    showAddButton: {
      type: Boolean,
      default: true,
    },
    useInifiniateLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    resetLoadingState() {
      this.$refs.infiniteLoading.resetLoadingState()
    },
    handleReachedEnd(event) {
      this.$emit('reached-end', event)
    },
  },
}
</script>

<style lang="scss" scoped>
.s-list {
  overflow-x: auto;
  display: flex;
  padding-top: 18px;
  padding-bottom: 18px;

  .s-item {
    margin-right: 60px;
  }
}
</style>

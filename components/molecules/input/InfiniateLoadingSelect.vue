<template>
  <div class="ils-wrapper">
    <ul class="ils-list">
      <li v-for="(option, index) in options" :key="index" class="ils-item">
        <input
          :id="`${name}-${index}`"
          v-model="innerValue"
          type="radio"
          class="ils-input"
          :value="option.code"
          :name="name"
        />
        <slot name="label" :option="option"
          ><label class="ils-label" :for="`${name}-${index}`">{{
            option.name
          }}</label></slot
        >
      </li>
    </ul>
    <InfiniteLoading
      ref="infiniteLoading"
      @reached-end="($state) => $emit('reached-end', $state)"
    />
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import InfiniteLoading from '@/components/molecules/pagination/InfiniteLoading'

export default {
  name: 'InfiniateLoadingSelect',
  emits: ['reached-end'],
  components: {
    InfiniteLoading,
  },
  props: {
    name: {
      type: [String, Number],
      default: uuidv4(),
    },
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [Number, String, Boolean],
      default: null,
    },
  },
  computed: {
    innerValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    resetLoadingState() {
      this.$refs.infiniteLoading.resetLoadingState()
    },
  },
}
</script>

<style lang="scss" scoped>
.ils-wrapper {
  border: 1px solid #ccc;
  overflow-y: scroll;
  height: 100%;

  .ils-list {
    margin: 0;

    .ils-item {
      .ils-label {
        width: 100%;
        font-size: 16px;
        padding: 8px;
        display: block;
      }
      .ils-label:hover {
        cursor: pointer;
      }

      .ils-input {
        display: none;

        &:checked + .ils-label {
          background-color: #b3e5fc;
        }
      }
    }
  }
}
</style>

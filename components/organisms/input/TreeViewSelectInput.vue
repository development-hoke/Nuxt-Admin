<template>
  <div>
    <MediumTitle v-if="title" class="center-align">{{ title }}</MediumTitle>
    <tree
      ref="tree"
      :options="options"
      :data="normalizedTree"
      @node:checked="handleChecked"
      @node:unchecked="handleUnchecked"
    >
      <div slot-scope="{ node }" class="node-container">
        <div class="section">
          <div class="row">
            <div class="col s12">
              <span class="node-text">{{ node.id }} | {{ node.text }}</span>
            </div>
          </div>
        </div>
      </div></tree
    >
  </div>
</template>

<script>
import Tree from 'liquor-tree'
import MediumTitle from '@/components/atoms/title/MediumTitle'

export default {
  name: 'TreeViewSelectInput',
  components: {
    Tree,
    MediumTitle,
  },
  props: {
    tree: {
      type: Array,
      required: true,
    },
    dict: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      options: {
        miltiple: false,
        checkbox: true,
        checkOnSelect: true,
        autoCheckChildren: false,
      },
      checkedDict: {},
      checkedThrottleId: null,
      uncheckedThrottleId: null,
    }
  },
  computed: {
    normalizedTree() {
      const tree = this.normalizeTree(this.tree)
      return tree
    },
  },
  beforeMount() {
    this.checkedDict = this.value.reduce((dict, id, index) => {
      return Object.assign(dict, {
        [id]: this.dict[id],
      })
    }, {})
  },
  methods: {
    normalizeTree(tree) {
      return tree.map(({ name, id, children, level }) => ({
        text: name,
        id,
        data: { level },
        state: { checked: this.checkedDict[id] !== undefined },
        children: Array.isArray(children) ? this.normalizeTree(children) : [],
      }))
    },

    handleChecked({ id }) {
      if (this.checkedDict[id]) {
        return
      }

      this.$set(this.checkedDict, id, this.dict[id])

      if (!this.checkedThrottleId) {
        clearTimeout(this.checkedThrottleId)
      }

      this.checkedThrottleId = setTimeout(
        () => this.$emit('input', Object.keys(this.checkedDict).map(Number)),
        50
      )
    },

    handleUnchecked({ id }) {
      if (!this.checkedDict[id]) {
        return
      }

      this.$delete(this.checkedDict, id)

      if (!this.uncheckedThrottleId) {
        clearTimeout(this.uncheckedThrottleId)
      }

      this.uncheckedThrottleId = setTimeout(
        () => this.$emit('input', Object.keys(this.checkedDict).map(Number)),
        50
      )
    },
  },
}
</script>

<style scoped lang="scss">
.node-container {
  width: 100%;
}
.tree {
  max-height: 80vh;
  overflow: auto;
  min-width: 30vw;
}
</style>

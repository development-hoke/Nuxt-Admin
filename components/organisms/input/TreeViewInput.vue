<template>
  <div>
    <tree ref="tree" :options="options" :data="normalizedTree">
      <div slot-scope="{ node }" class="node-container">
        <div class="section">
          <div>
            <div class="col s8">
              <span class="node-text">{{ node.id }} | {{ node.text }}</span>
            </div>
            <div class="col s3 node-controls right-align">
              <edit-button @click="handleClickEdit(node)" />
              <!-- 複数箇所で確認モーダルを出力しているため、DeleteButtonを使用しない -->
              <a
                href=""
                class="btn-floating red btn-small waves-effect waves-light"
                @click.prevent="handleClickRemove(node)"
                ><i class="material-icons">delete</i></a
              >
            </div>
            <div class="col s1 node-controls right-align">
              <add-button
                v-if="!isLastLevel(node)"
                @click="handleClickAdd(node)"
              />
            </div>
          </div>
        </div></div
    ></tree>
    <button-container @click="handleClickAdd(null)"
      ><i class="material-icons left">add</i>{{ name }}追加</button-container
    >
    <confirm-modal
      ref="confirmModal"
      type="warn"
      @ok="events.emit('confirmed', true)"
      @cancel="events.emit('confirmed', false)"
    >
      <template #title>{{ confirmTitle }}</template>
      <template #body>{{ confirmBody }}</template>
    </confirm-modal>
    <notice-modal ref="noticeModal" type="warn">
      <template #title>{{ noticeTitle }}</template>
      <template #body>{{ noticeBody }}</template>
    </notice-modal>
  </div>
</template>

<script>
import EventEmitter from 'events'
import Tree from 'liquor-tree'
import EditButton from '@/components/atoms/button/EditButton'
import AddButton from '@/components/atoms/button/AddButton'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import ConfirmModal from '@/components/organisms/modal/ConfirmModal'
import NoticeModal from '@/components/organisms/modal/NoticeModal'

export const denormalizeNode = ({ id, text, data, parent }) => ({
  id,
  name: text,
  level: data.level,
  sort: data.sort,
  parentId: parent?.id,
})

export const normalizeTree = (tree) =>
  tree.map(({ name, id, sort, children, level }) => ({
    text: name,
    id,
    data: { sort, level },
    children: Array.isArray(children) ? normalizeTree(children) : [],
  }))

const DROP_POS_ABOVE = 'drag-above'
const DROP_POS_BELOW = 'drag-below'
const DROP_POS_ON = 'drag-on'

export default {
  name: 'TreeViewInput',
  components: {
    Tree,
    EditButton,
    AddButton,
    ButtonContainer,
    ConfirmModal,
    NoticeModal,
  },
  props: {
    tree: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    maxLevel: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      events: new EventEmitter(),
      options: {
        miltiple: false,
        dnd: {
          onDragFinish: this.handleDragFinish.bind(this),
        },
      },
      confirmTitle: '',
      confirmBody: '',
      noticeTitle: '',
      noticeBody: '',
    }
  },
  computed: {
    normalizedTree() {
      const tree = normalizeTree(this.tree)
      this.updateTreeData(tree)
      return tree
    },
  },
  methods: {
    updateTreeData(tree, retry = 0) {
      if (retry > 5) {
        return
      }

      if (!this.$refs.tree) {
        setTimeout(() => this.updateTreeData(tree, retry + 1), 50)
        return
      }

      this.$refs.tree.setModel(tree)
    },

    handleClickAdd(parent) {
      this.$emit('add', parent ? denormalizeNode(parent) : parent)
    },

    handleClickEdit(node) {
      this.$emit('edit', denormalizeNode(node))
    },

    async handleClickRemove(node) {
      this.openConfirmModal(
        `${node.text}の削除`,
        `${node.text}を削除します。宜しいですか？`
      )

      const result = await new Promise((resolve) =>
        this.events.once('confirmed', resolve)
      )

      this.$refs.confirmModal.close()

      if (!result) {
        return
      }

      this.$emit('remove', denormalizeNode(node))
    },

    isLastLevel(node) {
      const count = this.countAncestors(node)

      return count + 1 === this.maxLevel
    },

    /**
     * @param {Object} targetNode
     * @param {Object} destinationNode
     * @param {String} dropPosition drag-above|drag-below|drag-on
     *
     * @return {Boolean} falseの場合移動をキャンセル（現状非同期処理ができないので常にfalseを返す）
     */
    handleDragFinish(targetNode, destinationNode, dropPosition) {
      if (!targetNode || !destinationNode) {
        return false
      }

      const descendantCount = this.countDescendants(targetNode)
      const ancestorCount = this.countAncestors(destinationNode)

      // `drag-on`はノードの中間あたりにドラッグした場合の値
      const offset = dropPosition === DROP_POS_ON ? 1 : 0

      if (ancestorCount + descendantCount + offset + 1 > this.maxLevel) {
        this.openNoticeModal(
          '移動できませんでした',
          '階層が深すぎるため移動が出来ません。'
        )
        return false
      }

      this.openConfirmModal(
        `${this.name}の移動`,
        `${this.name}を移動します。宜しいですか？`
      )

      targetNode = denormalizeNode(targetNode)
      destinationNode = denormalizeNode(destinationNode)

      new Promise((resolve) => this.events.once('confirmed', resolve)).then(
        (result) => {
          if (result) {
            this.$emit(
              'move',
              this.computeMovedOutput(targetNode, destinationNode, dropPosition)
            )
          }
          this.$refs.confirmModal.close()
        }
      )

      return false
    },

    countAncestors(node, count = 0) {
      if (node.parent) {
        return this.countAncestors(node.parent, ++count)
      }

      return count
    },

    countDescendants(node, count = 0) {
      let max = count

      if (node.children && node.children.length > 0) {
        for (const child in node.children) {
          const current = this.countDescendants(child, ++count)
          if (max < current) {
            max = current
          }
        }
      }

      return max
    },

    computeMovedOutput(targetNode, destinationNode, dropPosition) {
      return {
        id: targetNode.id,
        name: targetNode.name,
        parentId: this.computeParentId(destinationNode, dropPosition),
        sort: this.computeSort(destinationNode, dropPosition),
        level: this.computedLevel(destinationNode, dropPosition),
      }
    },

    computeParentId(destinationNode, dropPosition) {
      switch (dropPosition) {
        case DROP_POS_ABOVE:
          return destinationNode.parentId || null
        case DROP_POS_BELOW:
          return destinationNode.parentId || null
        case DROP_POS_ON:
        default:
          return destinationNode.id || null
      }
    },

    computeSort(destinationNode, dropPosition) {
      const { sort } = destinationNode

      switch (dropPosition) {
        case DROP_POS_ABOVE:
          return sort
        case DROP_POS_BELOW:
          return sort + 1
        case DROP_POS_ON:
        default:
          return Math.max(destinationNode.children.map(({ sort }) => sort)) + 1
      }
    },

    computedLevel(destinationNode, dropPosition) {
      const { level } = destinationNode

      switch (dropPosition) {
        case DROP_POS_ABOVE:
          return level
        case DROP_POS_BELOW:
          return level
        case DROP_POS_ON:
        default:
          return level + 1
      }
    },

    openConfirmModal(title = '', body = '') {
      this.confirmTitle = title
      this.confirmBody = body
      this.$refs.confirmModal.open()
    },

    openNoticeModal(title = '', body = '') {
      this.noticeTitle = title
      this.noticeBody = body
      this.$refs.noticeModal.open()
    },
  },
}
</script>

<style scoped lang="scss">
.node-container {
  width: 100%;
}
</style>

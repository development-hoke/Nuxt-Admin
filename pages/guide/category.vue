<template>
  <div>
    <div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
      <div class="container">
        <div class="row">
          <div class="col s12 m6 l6">
            <h5 class="breadcrumbs-title mt-0 mb-0">
              <span>ヘルプ管理</span>
            </h5>
          </div>
          <div class="col s12 m6 l6 right-align-md">
            <ol class="breadcrumbs mb-0">
              <li class="breadcrumb-item">
                <a href="/guide">ヘルプ管理</a>
              </li>
              <li class="breadcrumb-item">
                <a href="/guide/category">ヘルプカテゴリ管理</a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <div class="row mb-3">
              <tree ref="tree" :options="options" :data="items">
                <div
                  slot-scope="{ node }"
                  class="node-container"
                  style="width: 100%;"
                >
                  <div class="section">
                    <div>
                      <div class="col s7">
                        <span class="node-text">{{ node.text }}</span>
                      </div>
                      <div
                        class="col s5 node-controls"
                        style="text-align: right;"
                      >
                        <a
                          href="#"
                          class="btn-floating btn-small waves-effect waves-light"
                          @click.stop="editNode(node)"
                          ><i class="material-icons">edit</i></a
                        >
                        <a
                          href="#"
                          class="btn-floating btn-small waves-effect waves-light"
                          @click.stop="removeNode(node)"
                          ><i class="material-icons">delete</i></a
                        >
                      </div>
                    </div>
                  </div>
                </div></tree
              >

              <a
                class="btn-floating btn-small waves-effect waves-light"
                @click="addRootNode"
                ><i class="material-icons">add</i></a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="visibleFilter"
      style="
        position: absolute;
        left: 0;
        right: 0;
        top: 200px;
        margin: auto;
        z-index: 1000;
        width: 350px;
      "
    >
      <div class="card lighten-4 padding-8">
        <div class="row mb-5">
          <div class="col s4">
            <label class="typo__label">番号</label>
          </div>
          <div class="col s8">
            <input v-model="newNode.id" type="area" />
          </div>
        </div>
        <div class="row mb-8">
          <div class="col s4">
            <label class="typo__label">分類名</label>
          </div>
          <div class="col s8">
            <input v-model="newNode.text" type="area" />
          </div>
        </div>
        <div class="row center">
          <div class="col s12">
            <a class="btn waves-effect waves-light lightrn-1" @click="save"
              >保存</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LiquorTree from 'liquor-tree'

export default {
  components: {
    [LiquorTree.name]: LiquorTree,
  },
  data() {
    return {
      visibleFilter: false,
      items: [
        {
          id: 1,
          text: 'ログインについて',
          children: [
            { id: 11, text: 'パスワード関連' },
            {
              id: 12,
              text: 'メールアドレス関連',
              children: [
                { id: 121, text: 'パスワード関連' },
                { id: 122, text: 'パスワード関連' },
              ],
            },
            { id: 13, text: '規約' },
          ],
        },
        { id: 2, text: 'カートについて' },
      ],
      options: {
        miltiple: false,
        dnd: true,
      },
      selectedNode: {},
      newNode: {},
    }
  },
  mounted() {},
  methods: {
    showFilter() {
      this.visibleFilter = !this.visibleFilter
    },
    editNode(node, e) {
      this.selectedNode = null
      this.newNode = node
      this.showFilter()
    },

    removeNode(node) {
      if (confirm('Are you sure?')) {
        node.remove()
      }
    },

    addChildNode(node) {
      if (node.enabled()) {
        this.newNode = {}
        this.selectedNode = node
        this.showFilter()
      }
    },
    addRootNode() {
      this.newNode = {}
      this.selectedNode = this.$refs.tree
      this.showFilter()
    },
    save() {
      if (this.selectedNode) {
        this.selectedNode.append(this.newNode)
      }
      this.visibleFilter = !this.visibleFilter
    },
  },
}
</script>
<style scoped>
.title {
  font-size: 20px;
}
.breadcrumbs-bg-image {
  background-image: url('~assets/breadcrumb-bg.jpg') !important;
}
</style>

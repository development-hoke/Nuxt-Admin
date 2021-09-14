<template>
  <div class="row">
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
                <a href="/guide/create">新規作成</a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <div class="title">ヘルプ管理</div>
              <div class="row">
                <div class="col s12">
                  <input id="title" type="text" />
                </div>
              </div>
              <Editor v-model="editorData" :config="editorConfig"></Editor>
              <div class="row combine-3">
                <div class="col s4">
                  <div class="sub-container">
                    <div class="sub-title">カテゴリ</div>
                    <div class="sub-content">
                      <label>
                        <input type="checkbox" />
                        <span>アカウント登録について</span>
                      </label>
                      <label>
                        <input type="checkbox" />
                        <span>配送料について</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col s4">
                  <div class="sub-container">
                    <div class="sub-title">表示箇所</div>
                    <div class="sub-content">
                      <label>
                        <input type="checkbox" />
                        <span>お知らせ</span>
                      </label>
                      <label>
                        <input type="checkbox" />
                        <span>通常</span>
                      </label>
                      <label for="priority">優先度</label>
                      <input id="priority" type="text" />
                    </div>
                  </div>
                </div>
                <div class="col s4">
                  <div class="sub-container">
                    <div class="sub-title">よくある質問</div>
                    <div class="sub-content">
                      <label>
                        <input type="checkbox" />
                        <span>掲載する</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="btn-group">
                <a class="btn waves-effect waves-light purple accent-2">削除</a>
                <a class="btn waves-effect waves-light lightrn-1">プレビュー</a>
                <a class="btn waves-effect waves-light lightrn-1"
                  >下書きとして保存</a
                >
                <a class="btn waves-effect waves-light lightrn-1"
                  >保存して公開</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Editor from '@/components/atoms/input/Editor'

export default {
  components: {
    Editor,
  },
  data() {
    return {
      editorData: '',
    }
  },
  mounted() {},
  methods: {},
}
</script>
<style scoped>
.title {
  font-size: 20px !important;
  margin-bottom: 20px;
}
.new-create-btn {
  text-align: right;
  padding: 15px;
}
.breadcrumbs-bg-image {
  background-image: url('~assets/breadcrumb-bg.jpg') !important;
}
#title {
  margin-bottom: 2rem;
}

.combine-3 {
  margin-top: 2rem;
}
.row.combine-3 .col .sub-container {
  border: solid 5px #ccc;
  padding: 10px 30px;
  min-height: 276px;
}
.row.combine-3 .col .sub-container .sub-title {
  padding: 10px 0;
  font-size: 1.2rem;
}
.row.combine-3 .col .sub-container .sub-content {
  display: grid;
}
.row.combine-3 .col .sub-container .sub-content > * {
  margin: 10px 0;
}
.btn-group {
  margin-top: 3rem;
  display: flex;
  justify-content: space-evenly;
}
.btn-group a.btn {
  min-width: 200px;
}
.ck-editor__editable:not(.ck-editor__nested-editable) {
  min-height: 200px;
}
</style>

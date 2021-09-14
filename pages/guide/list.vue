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
                <a href="/guide/list">ヘルプ一覧</a>
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
              <div class="title">ヘルプ一覧</div>
              <div class="new-create-btn">
                <a href="/guide/create" class="btn">新規登録</a>
              </div>
              <div class="row">
                <div class="col s12">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>タイトル</th>
                        <th>表示箇所</th>
                        <th>カテゴリ</th>
                        <th>URL</th>
                        <th>作成者</th>
                        <th>日付</th>
                        <th>ステータス</th>
                        <th>よくある質問</th>
                        <th>優先度</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>アカウント登録ができない</td>
                        <td>通常</td>
                        <td>アカウント</td>
                        <td>https:ymdy.co.jp/help/xxx/xxx</td>
                        <td>bando</td>
                        <td>2020/03/04</td>
                        <td>公開</td>
                        <td></td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>キャンセルルールについて</td>
                        <td>通常</td>
                        <td>キャンセル</td>
                        <td>https:ymdy.co.jp/help/xxx/xxx</td>
                        <td>bando</td>
                        <td>2020/03/04</td>
                        <td>非公開</td>
                        <td>3</td>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>配送エリアについて</td>
                        <td>通常</td>
                        <td>配送</td>
                        <td>https:ymdy.co.jp/help/xxx/xxx</td>
                        <td>bando</td>
                        <td>2020/03/04</td>
                        <td>公開</td>
                        <td></td>
                        <td>4</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>購入商品について</td>
                        <td>通常</td>
                        <td>購入</td>
                        <td>https:ymdy.co.jp/help/xxx/xxx</td>
                        <td>morinaka</td>
                        <td>2020/03/04</td>
                        <td>公開</td>
                        <td>10</td>
                        <td>222</td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>ECサイトの使い方について</td>
                        <td>通常</td>
                        <td>使い方</td>
                        <td>https:ymdy.co.jp/help/xxx/xxx</td>
                        <td>morinaka</td>
                        <td>2020/03/04</td>
                        <td>公開</td>
                        <td></td>
                        <td>144444</td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td>返品の仕方</td>
                        <td>通常</td>
                        <td>返品</td>
                        <td>https:ymdy.co.jp/help/xxx/xxx</td>
                        <td>bando</td>
                        <td>2020/03/04</td>
                        <td>非公開</td>
                        <td>8</td>
                        <td>3020</td>
                      </tr>
                      <tr>
                        <td>7</td>
                        <td>配送が遅延しています</td>
                        <td>お知らせ</td>
                        <td></td>
                        <td>https:ymdy.co.jp/help/xxx/xxx</td>
                        <td>bando</td>
                        <td>2020/03/04</td>
                        <td>公開</td>
                        <td></td>
                        <td>22</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
</style>

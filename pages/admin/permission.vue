<template>
  <div class="row">
    <div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
      <div class="container">
        <div class="row">
          <div class="col s12 m6 l6">
            <h5 class="breadcrumbs-title mt-0 mb-0">
              <span>管理者権限</span>
            </h5>
          </div>
          <div class="col s12 m6 l6 right-align-md">
            <ol class="breadcrumbs mb-0">
              <li class="breadcrumb-item">
                <a href="/admin/log">管理者管理</a>
              </li>
              <li class="breadcrumb-item">
                <a href="/admin/permission">管理者権限</a>
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
              <div class="title">管理者権限</div>
              <div class="sub-title">各権限グループの権限</div>
              <div class="row">
                <div class="col s12">
                  <table class="bordered">
                    <thead>
                      <tr>
                        <th>画面</th>
                        <th>特権管理者</th>
                        <th>運営責任者</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>商品管理</td>
                        <td>編集可</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>会員管理</td>
                        <td>閲覧のみ</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="sub-title">各権限グループの個人情報閲覧について</div>
              <div class="row">
                <div class="col s12">
                  <table class="bordered">
                    <thead>
                      <tr>
                        <th></th>
                        <th>特権管理者</th>
                        <th>運営責任者</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>個人情報</td>
                        <td>閲覧可</td>
                        <td>閲覧不可</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
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
.sub-title {
  font-size: 1rem;
  margin: 3rem 0 1rem 0;
}
</style>

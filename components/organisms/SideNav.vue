<template>
  <aside
    class="sidenav-main nav-expanded nav-lock nav-collapsible sidenav-dark sidenav-active-rounded"
    :class="{
      'nav-collapsed': !showSidebar && !showHoverSidebar,
      'nav-expanded': !showSidebar && showHoverSidebar,
    }"
    @mouseenter="showHoverSidebar = !showHoverSidebar"
    @mouseleave="showHoverSidebar = !showHoverSidebar"
  >
    <div class="brand-sidebar">
      <h1 class="logo-wrapper">
        <a class="brand-logo darken-1" href="/">
          <span class="logo-text hide-on-med-and-down">YAMADAYA</span>
        </a>
        <a class="navbar-toggler" href="#" @click="toggleSidebar()">
          <i class="material-icons">{{ menuIcon }}</i>
        </a>
      </h1>
    </div>
    <ul
      id="slide-out"
      class="sidenav sidenav-collapsible leftside-navigation collapsible sidenav-fixed menu-shadow"
      data-menu="menu-navigation"
      data-collapsible="menu-accordion"
    >
      <li class="bold">
        <nuxt-link
          class="waves-effect waves-cyan"
          to="/dashboard"
          :class="{ active: isActive('/dashboard') }"
        >
          <i class="material-icons">dashboard</i>
          <span class="menu-title" data-i18n="Dashboard">ダッシュボード</span>
        </nuxt-link>
      </li>
      <li class="navigation-header">
        <a class="navigation-header-text">Shop</a>
        <i class="navigation-header-icon material-icons">more_horiz</i>
      </li>
      <li class="bold" :class="{ open: showReportSub, active: showReportSub }">
        <a
          class="collapsible-header waves-effect waves-cyan"
          @click="showReportSub = !showReportSub"
        >
          <i class="material-icons">insert_chart</i>
          <span class="menu-title" data-i18n="reportmg">レポート</span>
        </a>
        <div v-show="showReportSub" class="collapsible-body">
          <ul class="collapsible collapsible-sub" data-collapsible="accordion">
            <li>
              <nuxt-link
                to="/report/sales-tally"
                :class="{ active: isActive('/report/sales-tally') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">売り上げ集計</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/report/product-performance"
                :class="{ active: isActive('/report/product-performance') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">商品実績</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </li>
      <li class="bold" :class="{ open: showItemSub, active: showItemSub }">
        <a
          class="collapsible-header waves-effect waves-cyan"
          @click="showItemSub = !showItemSub"
        >
          <i class="material-icons">shopping_cart</i>
          <span class="menu-title" data-i18n="Dashboard">商品管理</span>
        </a>
        <div v-show="showItemSub" class="collapsible-body">
          <ul class="collapsible collapsible-sub" data-collapsible="accordion">
            <li>
              <nuxt-link to="/item" :class="{ active: isActive('/item') }">
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">商品一覧</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/item/bulk-upload"
                :class="{ active: isActive('/item/bulk-upload') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">商品情報一括登録</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/item/priority"
                :class="{
                  active: isActive('/item/priority'),
                }"
                ><i class="material-icons">radio_button_unchecked</i
                ><span data-i18n="Third level"
                  >商品優先度表示登録</span
                ></nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                to="/item/past-item"
                :class="{
                  active: isActive('/item/past-item'),
                }"
                ><i class="material-icons">radio_button_unchecked</i
                ><span data-i18n="Third level">過去の商品一覧</span></nuxt-link
              >
            </li>
          </ul>
        </div>
      </li>
      <li
        class="bold"
        :class="{ open: showInventorySub, active: showInventorySub }"
      >
        <a
          class="collapsible-header waves-effect waves-cyan"
          @click="showInventorySub = !showInventorySub"
        >
          <i class="material-icons">storage</i>
          <span class="menu-title" data-i18n="Dashboard">在庫管理</span>
        </a>
        <div v-show="showInventorySub" class="collapsible-body">
          <ul class="collapsible collapsible-sub" data-collapsible="accordion">
            <li>
              <nuxt-link
                to="/inventory"
                :class="{ active: isActive('/inventory') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">在庫一覧</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </li>
      <li class="bold">
        <nuxt-link
          class="waves-effect waves-cyan"
          to="/order"
          :class="{ active: isActive('/order') }"
        >
          <i class="material-icons">shopping_basket</i>
          <span class="menu-title" data-i18n="Modern">受注管理</span>
        </nuxt-link>
      </li>
      <li class="bold">
        <nuxt-link
          class="waves-effect waves-cyan"
          to="/event"
          :class="{ active: isActive('/event') }"
        >
          <i class="material-icons">event</i>
          <span class="menu-title" data-i18n="Modern">イベント管理</span>
        </nuxt-link>
      </li>
      <li class="navigation-header">
        <a class="navigation-header-text">System</a>
        <i class="navigation-header-icon material-icons">more_horiz</i>
      </li>
      <li
        class="bold"
        :class="{ open: showContentSub, active: showContentSub }"
      >
        <a
          class="collapsible-header waves-effect waves-cyan"
          @click="showContentSub = !showContentSub"
        >
          <i class="material-icons">laptop</i>
          <span class="menu-title" data-i18n="reportmg">コンテンツ管理</span>
        </a>
        <div v-show="showContentSub" class="collapsible-body">
          <ul class="collapsible collapsible-sub" data-collapsible="accordion">
            <li>
              <nuxt-link
                to="/top-content"
                :class="{ active: isActive('/top-content') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">トップ管理</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/plan" :class="{ active: isActive('/plan') }">
                <i class="material-icons">radio_button_unchecked</i>
                <span class="menu-title" data-i18n="Dashboard">企画管理</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/page" :class="{ active: isActive('/page') }">
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">静的ページ管理</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/help" :class="{ active: isActive('/help') }">
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">ヘルプ管理</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/help-category"
                :class="{ active: isActive('/help-category') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">ヘルプカテゴリ管理</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/information"
                :class="{ active: isActive('/information') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">お知らせ管理</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/urgent-notice"
                :class="{ active: isActive('/urgent-notice') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">緊急お知らせ</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </li>
      <li class="bold" :class="{ open: showMasterSub, active: showMasterSub }">
        <a
          class="collapsible-header waves-effect waves-cyan"
          @click="showMasterSub = !showMasterSub"
        >
          <i class="material-icons">keyboard</i>
          <span class="menu-title" data-i18n="Dashboard">マスタ管理</span>
        </a>
        <div v-show="showMasterSub" class="collapsible-body">
          <ul class="collapsible collapsible-sub" data-collapsible="accordion">
            <li>
              <nuxt-link
                to="/master/brand"
                :class="{ active: isActive('/master/brand') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">ブランドマスタ</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/master/color-panel"
                :class="{ active: isActive('/master/color-panel') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">色パネル・表示色マスタ</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/master/sales-type"
                :class="{ active: isActive('/master/sales-type') }"
                ><i class="material-icons">radio_button_unchecked</i
                ><span data-i18n="Third level">販売タイプ管理</span></nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                to="/online-category"
                :class="{ active: isActive('/online-category') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span class="menu-title" data-i18n="Dashboard"
                  >オンライン分類</span
                >
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/online-tag"
                :class="{ active: isActive('/online-tag') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span class="menu-title" data-i18n="Dashboard"
                  >オンラインタグ</span
                >
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/delivery-setting"
                :class="{ active: isActive('/delivery-setting') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span class="menu-title" data-i18n="Dashboard"
                  >配送料金設定</span
                >
              </nuxt-link>
            </li>
          </ul>
        </div>
      </li>
      <li class="bold" :class="{ open: showAdminSub, active: showAdminSub }">
        <a
          class="collapsible-header waves-effect waves-cyan"
          @click="showAdminSub = !showAdminSub"
        >
          <i class="material-icons">verified_user</i>
          <span class="menu-title" data-i18n="Dashboard">管理者管理</span>
        </a>
        <div v-show="showAdminSub" class="collapsible-body">
          <ul class="collapsible collapsible-sub" data-collapsible="accordion">
            <li>
              <nuxt-link
                to="/admin/log"
                :class="{ active: isActive('/admin/log') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">管理者ログ</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/admin/login"
                :class="{ active: isActive('/admin/login') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">代理ログイン</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/admin/permission"
                :class="{ active: isActive('/admin/permission') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">権限閲覧</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </li>
      <li
        v-if="debugMode"
        class="bold"
        :class="{ open: showDebugSub, active: showDebugSub }"
      >
        <a
          class="collapsible-header waves-effect waves-cyan"
          @click="showDebugSub = !showDebugSub"
        >
          <i class="material-icons">build</i>
          <span class="menu-title" data-i18n="Dashboard">デバッグ用</span>
        </a>
        <div v-show="showDebugSub" class="collapsible-body">
          <ul class="collapsible collapsible-sub" data-collapsible="accordion">
            <li>
              <nuxt-link
                to="/debug/delivered"
                :class="{ active: isActive('/debug/delivered') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">配送完了処理</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/debug/reset-password"
                :class="{ active: isActive('/debug/reset-password') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">パスワードのリセット</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/debug/online-categories"
                :class="{ active: isActive('/debug/online-categories') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">オンラインカテゴリ</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/debug/online-tags"
                :class="{ active: isActive('/debug/online-tags') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">システムトークン</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/debug/stock-update"
                :class="{ active: isActive('/debug/stock-update') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">在庫更新</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/debug/reserve-arrivaled"
                :class="{ active: isActive('/debug/reserve-arrivaled') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">予約商品入荷通知</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/debug/backorder-arrivaled"
                :class="{ active: isActive('/debug/backorder-arrivaled') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">取り寄せ商品入荷通知</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                to="/debug/backorder-notfound"
                :class="{ active: isActive('/debug/backorder-notfound') }"
              >
                <i class="material-icons">radio_button_unchecked</i>
                <span data-i18n="Modern">取り寄せ商品が見つからない通知</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      menuIcon: 'radio_button_checked',
      showSidebar: true,
      showHoverSidebar: false,
      showMasterSub: false,
      showBrandTypeSub: false,
      showItemSub: false,
      showInventorySub: false,
      showReportSub: false,
      showContentSub: false,
      showAdminSub: false,
      showDebugSub: false,
      debugMode: false,
      visibleFilter: {
        brand: false,
        guide: false,
        item: false,
        inventory: false,
        report: false,
        admin: false,
      },
    }
  },
  mounted() {
    console.log(this.$route.fullPath)
    this.debugMode = process.env.debugMode
  },
  methods: {
    isActive(path) {
      if (this.$route.fullPath === path) {
        return true
      }
      return false
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
      if (this.showSidebar) {
        this.menuIcon = 'radio_button_checked'
      } else {
        this.menuIcon = 'radio_button_unchecked'
      }
    },
  },
}
</script>
<style scoped>
.collapsible-body {
  display: block;
}
.sidenav {
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.sidenav::-webkit-scrollbar {
  display: none;
}
.brand-sidebar .logo-wrapper a.navbar-toggler {
  top: 0;
}
.sidenav-main {
  transition: 0.3s ease all !important;
}
</style>

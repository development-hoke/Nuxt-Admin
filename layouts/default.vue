<template>
  <div class="row root doc">
    <Header />
    <side-nav />
    <transition name="page">
      <main id="main">
        <Nuxt />
      </main>
    </transition>
    <GlobalLoading />
  </div>
</template>

<script>
import Header from '@/components/organisms/Header'
import SideNav from '@/components/organisms/SideNav'
import GlobalLoading from '@/components/organisms/loading/GlobalLoading'

export default {
  components: {
    Header,
    SideNav,
    GlobalLoading,
  },
  head: {
    bodyAttrs: {
      class:
        'vertical-layout page-header-light vertical-menu-collapsible vertical-dark-menu preload-transitions 2-columns',
      'data-open': 'click',
      'data-menu': 'vertical-dark-menu',
      'data-col': '2-columns',
    },
  },
}
</script>

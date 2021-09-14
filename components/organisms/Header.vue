<template>
  <header id="header" class="page-topbar">
    <div class="navbar navbar-fixed">
      <nav
        class="navbar-main navbar-color nav-collapsible sideNav-lock navbar-light"
      >
        <div class="nav-wrapper">
          <ul class="navbar-list right">
            <li>
              <div class="black-text">ログイン名 : {{ userProfile.name }}</div>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import LogoutButton from '@/components/atoms/button/LogoutButton'

export default {
  name: 'Header',
  components: {
    LogoutButton,
  },
  computed: {
    ...mapGetters({
      userProfile: 'currentUser/profile',
    }),
  },
}
</script>

export default function ({ store, route }) {
  if (route.name !== 'login') {
    store.dispatch('currentUser/fetch')
  }
}

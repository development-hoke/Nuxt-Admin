export default function ({ app, route, redirect }) {
  console.log(route)
  app.store.commit('common/loading', false)
}

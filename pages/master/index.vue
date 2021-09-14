<script>
export default {
  middleware({ redirect, route }) {
    if (route.name === 'master') {
      return redirect({ name: 'master-brand' })
    }
  },
}
</script>

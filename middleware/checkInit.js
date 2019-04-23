export default function({ route, redirect, store }) {
  if (store.state.user.id && !store.state.user.data.accountId) {
    // init yet
    if (route.path !== '/i/init') {
      return redirect('/i/init')
    }
  } else if (store.state.user.id && store.state.user.data.accountId) {
    // already init
    if (route.path == '/i/init') {
      return redirect('/' + store.state.user.data.accountId)
    }
  } else {
    // not login
    if (route.path == '/i/init') {
      return redirect('/')
    }
  }
}

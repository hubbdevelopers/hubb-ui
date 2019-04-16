export default function({ route, redirect, store }) {
  if (store.state.user.uid && !store.state.user.user.account_id) {
    // init yet
    if (route.path !== '/i/init') {
      return redirect('/i/init')
    }
  } else if (store.state.user.uid && store.state.user.user.account_id) {
    // already init
    if (route.path == '/i/init') {
      return redirect('/' + store.state.user.user.account_id)
    }
  } else {
    // not login
    if (route.path == '/i/init') {
      return redirect('/')
    }
  }
}

export default async ({ app }) => {
  try {
    await app.store.dispatch('user/initUser')
  } catch (e) {
    console.log(e)
  }
}

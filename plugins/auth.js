export default async function ({ $auth }) {
  if (!$auth.loggedIn) {
    return
  }

  const auth = $auth
  const authStrategy = auth.strategy.name

  if (authStrategy === 'facebook' || authStrategy === 'google') {
    const token = auth.getToken(authStrategy).substr(7)
    const url = `/auth/${authStrategy}`

    try {
      const {data} = await app.$axios.$post(url, { token: token })
      auth.setToken('local', "Bearer "+ data.access_token)
      setTimeout( async () => {
        auth.setStrategy('local')
        setTimeout( async () => {
          await auth.fetchUser()
        })
      })
    } catch (e) {
        console.log(e)
        this.$auth.logout()
    }
  }
}

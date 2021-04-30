import { resolve, Promise } from "q";

export const state = () => ({
  drawer: false,
  defaultDrawer: false,
  miniVariant: false,
  categories: {},
  siteOptions: {},
  contentLoading: true,
  articleInterval: undefined,
  //
  emailVerify: '',
})

export const mutations = {
  toggleDrawer(state) {
    state.drawer = !state.drawer
  },
  drawer(state, val) {
    state.drawer = val
  },
  toggleMiniVariant(state) {
    state.miniVariant = !state.miniVariant
  },
  miniVariant(state, val) {
    state.miniVariant = val
  },
  toggleDefaultDrawer(state) {
    state.defaultDrawer = !state.defaultDrawer
  },
  defaultDrawer(state, val) {
    state.defaultDrawer = val
  },
  SET_SITE_OPTIONS(state, val) {
    state.siteOptions = val
  },
  SET_CATEGORIES(state, val) {
    state.categories = val
  },
  UPDATE_CONTENT_LOADING(state, val) {
    state.contentLoading = val
  },
  SET_ARTICLE_INTERVAL(state, val) {
    state.articleInterval = val
  },
  CLEAR_ARTICLE_INTERVAL(state) {
    state.articleInterval = undefined
  },
  SET_EMAIL_VERIFY(state, val) {
    state.emailVerify = val
  }
}

export const actions = {
  nuxtServerInit({ dispatch, commit }, context) {
    return Promise.all([
      dispatch('getCategoryList'),
      dispatch('getSiteOptions')
    ])
  },
  getCategoryList({ commit }) {
    return this.$api.getCategoryList()
      .then((res) => {
        commit('SET_CATEGORIES', res.data.data)
        resolve()
      })
      .catch(() => {
        resolve(false)
      })
  },
  getSiteOptions({ commit }) {
    return this.$api.getSiteOptions()
      .then((res) => {
        commit('SET_SITE_OPTIONS', res.data)
        resolve()
      })
      .catch(() => {
        resolve(false)
      })
  },
}

export const getters = {
  // Auth
  name: state => (state.auth.user) ? state.auth.user.name : null,
  username: state => (state.auth.user) ? state.auth.user.username : null,
  avatar: state => (state.auth.user) ? state.auth.user.avatar : null,
  status: state => (state.auth.user) ? state.auth.user.status : null,
  roles: state => (state.auth.user) ? state.auth.user.roles : null,
  // Pages
  categories: state => state.categories,
  contentLoading: state => state.contentLoading,
}

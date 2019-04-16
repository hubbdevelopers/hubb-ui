import { auth, storage } from '~/plugins/firebase'
import firebase from 'firebase'
const storageRef = storage.ref()

export const state = () => ({
  user: {},
  pages: [],
  communities: [],
  followings: [],
  timeline: [],
  likes: [],
  notifications: [],
  id: '', // DB ID
  uid: '', // Firebase UID
  accountId: '', // ACCOUNT ID
  email: ''
})

export const actions = {
  initUser({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async authUser => {
        if (authUser) {
          try {
            const idToken = await authUser.getIdToken(/* forceRefresh */ true)
            this.$axios.setToken(idToken, 'Bearer')
          } catch (e) {
            console.log(e)
            reject()
          }

          const user = await this.$axios.$get(`/users?uid=${authUser.uid}`)
          commit('updateId', user.data.ID)
          commit('updateEmail', authUser.email)
          dispatch('fetchUser')
          dispatch('fetchPages')
          dispatch('fetchCommunities')
          dispatch('fetchFollowings')
          dispatch('fetchTimeline')
          dispatch('fetchLikes')
          //dispatch('fetchNotifications')
          resolve()
        } else {
          console.log('not login')
          reject()
        }
      })
    })
  },

  signup({ commit }, param) {
    return new Promise(async (resolve, reject) => {
      try {
        const authData = await auth.createUserWithEmailAndPassword(
          param.email,
          param.password
        )
        param.uid = authData.user.uid
        const res = await this.$axios.$post('users', param)

        commit('updateId', res.data.ID)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  reauthenticate({ state }, param) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = auth.currentUser
        const credentials = firebase.auth.EmailAuthProvider.credential(
          state.email,
          param.password
        )

        await user.reauthenticateAndRetrieveDataWithCredential(credentials)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  deleteUser({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = auth.currentUser
        await user.delete()
        commit('clearUserState')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // eslint-disable-next-line no-empty-pattern
  updatePassword({}, param) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = auth.currentUser
        await user.updatePassword(param.password)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  logout({ commit }) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit('clearUserState')
          resolve()
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  initialUpdate({ dispatch, state }, param) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$axios.$put(`users/${state.id}/init`, param)
        dispatch('fetchUser')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  updateProfile(
    { commit, state },
    { name, description, birthday, homepage, twitter, facebook, instagram }
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const param = {
          name: name,
          description: description,
          birthday: birthday,
          homepage: homepage,
          twitter: twitter,
          facebook: facebook,
          instagram: instagram
        }
        const user = await this.$axios.$put(`users/${state.id}/profile`, param)
        commit('updateUser', user.data)
        resolve()
      } catch (e) {
        console.error('Error writing document: ', e)
        reject(e)
      }
    })
  },

  updateImage({ state, commit }, imageBlob) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const uuidv1 = require('uuid/v1')
      const imagePath = 'images/user/' + state.uid + '/' + uuidv1()
      const imageRef = storageRef.child(imagePath)

      try {
        await imageRef.put(imageBlob)
        const url = await imageRef.getDownloadURL()

        const param = { image: url }
        const user = await this.$axios.$put(`users/${state.id}/images`, param)
        commit('updateUser', user.data)
        resolve()
      } catch (e) {
        console.error('Error writing document: ', e)
        reject(e)
      }
    })
  },

  createPage({ dispatch, state }, pageName) {
    pageName = pageName || 'untitled'

    return new Promise(async (resolve, reject) => {
      try {
        const param = {
          name: pageName,
          ownerId: Number(state.id),
          ownerType: 'users'
        }
        const page = await this.$axios.$post('pages', param)
        dispatch('fetchPages')
        resolve(page.data)
      } catch (e) {
        console.error('Error writing document: ', e)
        reject(e)
      }
    })
  },

  createCommunity({ dispatch, state }, communityName) {
    return new Promise(async (resolve, reject) => {
      const param = { name: communityName, userId: Number(state.id) }
      try {
        const community = await this.$axios.$post('/communities', param)
        dispatch('fetchCommunities')
        resolve(community.data)
      } catch (e) {
        reject(e)
      }
    })
  },

  deleteCommunity({ dispatch }, communityId) {
    return new Promise(async (resolve, reject) => {
      try {
        const community = await this.$axios.$delete(
          `/communities/${communityId}`
        )
        dispatch('fetchCommunities')
        resolve(community)
      } catch (e) {
        reject(e)
      }
    })
  },

  createCommunityPage({ dispatch }, { pageName, communityId }) {
    pageName = pageName || 'untitled'

    return new Promise(async (resolve, reject) => {
      try {
        const param = {
          name: pageName,
          ownerId: Number(communityId),
          ownerType: 'communities'
        }
        const page = await this.$axios.$post('pages', param)
        dispatch('fetchPages')
        resolve(page.data)
      } catch (e) {
        console.error('Error writing document: ', e)
        reject(e)
      }
    })
  },

  deletePage({ dispatch }, pageId) {
    return new Promise(async (resolve, reject) => {
      try {
        const page = await this.$axios.$delete(`pages/${pageId}`)
        dispatch('fetchPages')
        resolve(page)
      } catch (e) {
        reject(e)
      }
    })
  },

  async fetchUser({ commit, state }) {
    const user = await this.$axios.$get(`users/${state.id}`)
    commit('updateAccountId', user.data.AccountId)
    commit('updateUId', user.data.UID)
    commit('updateUser', user.data)
  },

  async fetchPages({ commit, state }) {
    const pages = await this.$axios.$get(`pages?userid=${state.id}`)
    commit('updatePages', pages.data)
  },

  async fetchCommunities({ commit, state }) {
    const communities = await this.$axios.$get(`communities?userid=${state.id}`)
    commit('updateCommunities', communities.data)
  },

  async fetchFollowings({ commit, state }) {
    const followings = await this.$axios.$get(`users/${state.id}/followings`)
    commit('updateFollowings', followings.data)
  },

  async fetchTimeline({ commit, state }) {
    const timeline = await this.$axios.$get(`users/${state.id}/timeline`)
    commit('updateTimeline', timeline.data)
  },

  async fetchLikes({ commit, state }) {
    const likes = await this.$axios.$get(`likes?userid=${state.id}`)
    commit('updateLike', likes.data)
  },

  // async fetchNotifications({commit, state}) {
  //   if(!state.user || !state.accountId) {
  //     return
  //   }
  //   const notifications = await usersRef.doc(state.accountId).collection('notifications').get()
  //   const data = notifications.docs.map(notification => {
  //     return {id: notification.id, data: notification.data()}
  //   });
  //   commit('updateLike', data)
  // },

  followUser({ dispatch, state }, followingId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$axios.$post(
          `/users/${state.id}/follow/users/${followingId}`
        )
        dispatch('fetchFollowings')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  unfollowUser({ dispatch, state }, followingId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$axios.$delete(
          `/users/${state.id}/follow/users/${followingId}`
        )
        dispatch('fetchFollowings')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  followCommunity({ dispatch, state }, followingId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$axios.$post(
          `/users/${state.id}/follow/communities/${followingId}`
        )
        dispatch('fetchFollowings')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  unFollowCommunity({ dispatch, state }, followingId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$axios.$delete(
          `/users/${state.id}/follow/communities/${followingId}`
        )
        dispatch('fetchFollowings')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  likePage({ dispatch, state }, pageId) {
    return new Promise(async (resolve, reject) => {
      const param = { userId: Number(state.id), pageId: Number(pageId) }

      try {
        const comment = await this.$axios.$post('/likes', param)
        dispatch('fetchLikes')
        resolve(comment)
      } catch (e) {
        reject(e)
      }
    })
  },

  unlikePage({ dispatch, state }, pageId) {
    return new Promise(async (resolve, reject) => {
      try {
        const comment = await this.$axios.$delete(
          `/likes?pageid=${pageId}&userid=${state.id}`
        )
        dispatch('fetchLikes')
        resolve(comment)
      } catch (e) {
        reject(e)
      }
    })
  },

  createComment({ state }, { pageId, text }) {
    return new Promise(async (resolve, reject) => {
      const param = {
        text: text,
        userId: Number(state.id),
        pageId: Number(pageId)
      }

      try {
        const comment = await this.$axios.$post('/comments', param)
        resolve(comment)
      } catch (e) {
        reject(e)
      }
    })
  },

  // eslint-disable-next-line no-empty-pattern
  deleteComment({}, { commentId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const comment = await this.$axios.$delete(`/comments/${commentId}`)
        resolve(comment)
      } catch (e) {
        reject(e)
      }
    })
  }
}

export const mutations = {
  updateUser(state, user) {
    state.user = user
  },

  updateId(state, id) {
    state.id = id
  },

  updateUId(state, uid) {
    state.uid = uid
  },

  updateAccountId(state, accountId) {
    state.accountId = accountId
  },

  updateUserName(state, name) {
    state.user.name = name
  },

  updatePages(state, pages) {
    state.pages = pages
  },

  updateCommunities(state, communities) {
    state.communities = communities
  },

  updateFollowings(state, followings) {
    state.followings = followings
  },

  updateTimeline(state, timeline) {
    state.timeline = timeline
  },

  updateLike(state, likes) {
    state.likes = likes
  },

  updateEmail(state, email) {
    state.email = email
  },

  // updateNotification (state, notifications) {
  //   state.notifications = notifications
  // },

  clearUserState(state) {
    state.user = {}
    state.pages = []
    state.communities = []
    state.followings = []
    state.timeline = []
    state.uid = ''
    state.accountId = ''
  }
}

export const getters = {
  getId: state => {
    return state.id
  },

  getAccountId: state => {
    return state.accountId
  },

  getImage: state => {
    return state.user.Image
      ? state.user.Image
      : 'https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg'
  },

  isCommunityMember: state => communityId => {
    return Boolean(
      state.communities.filter(community => community.ID == communityId).length
    )
  },

  isCommunityOwner: state => communityOwnerAccountId => {
    return communityOwnerAccountId === state.accountId
  },

  isFollowingUser: state => userId => {
    return Boolean(
      state.followings.filter(
        following =>
          following.FollowingId == userId && following.FollowingType === 'user'
      ).length
    )
  },

  isFollowingCommunity: state => communityId => {
    return Boolean(
      state.followings.filter(
        following =>
          following.FollowingId == communityId &&
          following.FollowingType === 'community'
      ).length
    )
  },

  isMyAccountId: state => accountId => {
    return accountId === state.accountId
  },

  isMyId: state => id => {
    return id == state.id
  },

  isLogin: state => {
    return Boolean(state.uid)
  },

  isLikedPage: state => pageId => {
    return Boolean(state.likes.filter(like => like.PageId == pageId).length)
  },

  getTimeline: state => {
    return state.timeline
  },

  getNotifications: state => {
    return state.notifications
  }
}

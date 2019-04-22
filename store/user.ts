/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { auth, storage } from '~/plugins/firebase'
import firebase from 'firebase'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { UserData, blankUser } from '~/common/user'
import { Page, PageData } from '~/common/page'
const db = firebase.firestore()
const storageRef = storage.ref()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface UsersState {
  user: UserData
  pages: Page[]
  communities: any
  followings: any
  timeline: Page[]
  likes: any
  notifications: any
  uid: string // Firebase UID
  email: string
}

export const state: UsersState = {
  user: blankUser.data,
  pages: [],
  communities: [],
  followings: [],
  timeline: [],
  likes: [],
  notifications: [],
  uid: '', // Firebase UID
  email: ''
}

export const actions: ActionTree<UsersState, RootState> = {
  initUser({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async authUser => {
        if (authUser) {
          const doc = await db
            .collection('users')
            .doc(authUser.uid)
            .get()
          if (doc.exists) {
            const user = doc.data()
            commit('updateUser', user)
          } else {
            console.log('No such document!')
          }

          commit('updateUid', authUser.uid)
          commit('updateEmail', authUser.email)
          dispatch('fetchPages')
          // dispatch('fetchCommunities')
          // dispatch('fetchFollowings')
          // dispatch('fetchTimeline')
          // dispatch('fetchLikes')
          // dispatch('fetchNotifications')
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
        param.uid = authData.user!.uid
        await db
          .collection('users')
          .doc(authData.user!.uid)
          .set({ createdAt: firebase.firestore.FieldValue.serverTimestamp() })

        commit('updateUid', param.uid)
        // const res = await this.$axios.$post('users', param)

        //commit('updateId', res.data.ID)
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

        await user!.reauthenticateAndRetrieveDataWithCredential(credentials)
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
        await user!.delete()
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
        await user!.updatePassword(param.password)
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

  initialUpdate({ state }, { accountId, name }) {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .collection('users')
          .doc(state.uid)
          .set({ accountId: accountId, name: name })
        // dispatch('fetchUser')
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
        const user = await this.$axios.$put(`users/${state.uid}/profile`, param)
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
        const user = await this.$axios.$put(`users/${state.uid}/images`, param)
        commit('updateUser', user.data)
        resolve()
      } catch (e) {
        console.error('Error writing document: ', e)
        reject(e)
      }
    })
  },

  createPage({ state }, pageName) {
    pageName = pageName || 'untitled'

    return new Promise(async (resolve, reject) => {
      try {
        const param = {
          name: pageName,
          ownerId: state.uid,
          ownerType: 'user',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }

        const doc = await db.collection('pages').add(param)
        resolve(doc.id)
      } catch (e) {
        console.error('Error writing document: ', e)
        reject(e)
      }
    })
  },

  createCommunity({ dispatch, state }, communityName) {
    return new Promise(async (resolve, reject) => {
      const param = { name: communityName, userId: Number(state.uid) }
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

  // async fetchUser({ commit, state }) {

  // },

  async fetchPages({ commit, state }) {
    try {
      const query = await db
        .collection('pages')
        .where('ownerId', '==', state.uid)
        .get()

      if (query.size > 0) {
        const pages = query.docs.map(
          (doc): Page => {
            return { id: doc.id, data: doc.data() as PageData }
          }
        )
        commit('updatePages', pages)
      }
    } catch (e) {
      console.log(e)
    }
  },

  async fetchCommunities({ commit, state }) {
    const communities = await this.$axios.$get(
      `communities?userid=${state.uid}`
    )
    commit('updateCommunities', communities.data)
  },

  async fetchFollowings({ commit, state }) {
    const followings = await this.$axios.$get(`users/${state.uid}/followings`)
    commit('updateFollowings', followings.data)
  },

  async fetchTimeline({ commit, state }) {
    const timeline = await this.$axios.$get(`users/${state.uid}/timeline`)
    commit('updateTimeline', timeline.data)
  },

  async fetchLikes({ commit, state }) {
    const likes = await this.$axios.$get(`likes?userid=${state.uid}`)
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
          `/users/${state.uid}/follow/users/${followingId}`
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
          `/users/${state.uid}/follow/users/${followingId}`
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
          `/users/${state.uid}/follow/communities/${followingId}`
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
          `/users/${state.uid}/follow/communities/${followingId}`
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
      const param = { userId: Number(state.uid), pageId: Number(pageId) }

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
          `/likes?pageid=${pageId}&userid=${state.uid}`
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
      try {
        const batch = db.batch()

        const userRef = db
          .collection('users')
          .doc(state.uid)
          .collection('comments')
          .doc()
        batch.set(userRef, {
          pageId: pageId,
          text: text,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        const pageRef = db
          .collection('pages')
          .doc(pageId)
          .collection('comments')
          .doc(userRef.id)
        batch.set(pageRef, {
          userId: state.uid,
          text: text,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        await batch.commit()
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // eslint-disable-next-line no-empty-pattern
  deleteComment({ state }, { pageId, commentId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const batch = db.batch()

        const userRef = db
          .collection('users')
          .doc(state.uid)
          .collection('comments')
          .doc(commentId)
        batch.delete(userRef)

        const pageRef = db
          .collection('pages')
          .doc(pageId)
          .collection('comments')
          .doc(commentId)
        batch.delete(pageRef)

        await batch.commit()
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}

export const mutations: MutationTree<UsersState> = {
  updateUser(state, user: UserData) {
    state.user = user
  },

  updateUid(state, uid: string) {
    state.uid = uid
  },

  updatePages(state, pages: Page[]) {
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
    state.user = blankUser.data
    state.pages = []
    state.communities = []
    state.followings = []
    state.timeline = []
    state.uid = ''
  }
}

export const getters: GetterTree<UsersState, RootState> = {
  getAccountId: state => {
    return state.user.accountId
  },

  getImage: state => {
    return state.user && state.user.image
      ? state.user.image
      : 'https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg'
  },

  isMyUid: state => (uid: string): boolean => {
    return state.uid === uid
  },

  isCommunityMember: state => communityId => {
    return Boolean(
      state.communities.filter(community => community.ID == communityId).length
    )
  },

  isCommunityOwner: state => communityOwnerAccountId => {
    return communityOwnerAccountId === state.user.accountId
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
    return accountId === state.user.accountId
  },

  isLogin: state => {
    return !!state.uid
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

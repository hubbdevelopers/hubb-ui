/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { auth, storage } from '~/plugins/firebase'
import firebase from 'firebase'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { User, UserData, FollowUser, blankUser } from '~/common/user'
import { Page, PageData } from '~/common/page'
const db = firebase.firestore()
const storageRef = storage.ref()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface UsersState {
  data: UserData
  pages: Page[]
  communities: any
  timeline: Page[]
  notifications: any
  followingUsers: FollowUser[]
  followers: FollowUser[]
  id: string // Firebase UID
  email: string
}

export const state: UsersState = {
  data: blankUser.data,
  pages: [],
  communities: [],
  timeline: [],
  notifications: [],
  followingUsers: [],
  followers: [],
  id: '', // Firebase UID
  email: ''
}

export const actions: ActionTree<UsersState, RootState> = {
  initUser({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async authUser => {
        if (authUser) {
          commit('updateId', authUser.uid)
          commit('updateEmail', authUser.email)
          dispatch('fetchUser')
          dispatch('fetchPages')
          dispatch('fetchFollowingUsers')
          dispatch('fetchFollowers')
          dispatch('fetchTimeline')

          // dispatch('fetchCommunities')
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
        await db
          .collection('users')
          .doc(authData.user!.uid)
          .set({ createdAt: firebase.firestore.FieldValue.serverTimestamp() })

        commit('updateId', authData.user!.uid)
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

  initialUpdate({ state, dispatch }, { accountId, name }) {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .collection('users')
          .doc(state.id)
          .set({ accountId: accountId, name: name })
        dispatch('fetchUser')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  updateProfile(
    { dispatch, state },
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
        await db
          .collection('users')
          .doc(state.id)
          .update(param)

        dispatch('fetchUser')
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
      const imagePath = 'images/user/' + state.id + '/' + uuidv1()
      const imageRef = storageRef.child(imagePath)

      try {
        await imageRef.put(imageBlob)
        const url = await imageRef.getDownloadURL()

        await db
          .collection('users')
          .doc(state.id)
          .update({ image: url })
        commit('updateImage', url)
        resolve()
      } catch (e) {
        console.error('Error writing document: ', e)
        reject(e)
      }
    })
  },

  createPage({ state, dispatch }, pageName = 'untitled') {
    return new Promise(async (resolve, reject) => {
      try {
        const param = {
          name: pageName,
          ownerId: state.id,
          ownerType: 'user',
          draft: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }

        const doc = await db.collection('pages').add(param)
        dispatch('fetchPages')
        resolve(doc.id)
      } catch (e) {
        console.error('Error writing document: ', e)
        reject(e)
      }
    })
  },

  updatePage({ dispatch }, { id, draft, name, content, image }) {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .collection('pages')
          .doc(id)
          .update({
            draft: draft,
            namd: name,
            content: content,
            image: image,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          })
        dispatch('fetchPages')
        resolve()
      } catch (e) {
        console.error('Error writing document: ', e)
        reject()
      }
    })
  },

  deletePage({ dispatch }, pageId) {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .collection('pages')
          .doc(pageId)
          .delete()
        dispatch('fetchPages')
        resolve()
      } catch (e) {
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

  async fetchUser({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await db
          .collection('users')
          .doc(state.id)
          .get()

        if (doc.exists) {
          const user = doc.data()
          commit('updateUser', user)
        } else {
          console.log('No such document!')
        }
        resolve()
      } catch (e) {
        reject()
      }
    })
  },

  async fetchPages({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = await db
          .collection('pages')
          .where('ownerId', '==', state.id)
          .get()

        if (query.size > 0) {
          const pages = query.docs.map(
            (doc): Page => {
              return { id: doc.id, data: doc.data() as PageData }
            }
          )
          commit('updatePages', pages)
        }
        resolve()
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  },

  async fetchCommunities({ commit, state }) {
    const communities = await this.$axios.$get(`communities?userid=${state.id}`)
    commit('updateCommunities', communities.data)
  },

  async fetchTimeline({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const snapshot = await db
          .collection('users')
          .doc(state.id)
          .collection('timeline')
          .get()

        const timeline: Page[] = snapshot.docs.map(
          (doc): Page => {
            return { id: doc.id, data: doc.data() as PageData }
          }
        )

        commit('updateTimeline', timeline)
        resolve()
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
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

  fetchFollowingUsers({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = await db
          .collection('users')
          .doc(state.id)
          .collection('followingUsers')
          .get()

        if (query.size > 0) {
          const ids = query.docs.map(
            (doc): FollowUser => {
              return doc.data() as FollowUser
            }
          )
          commit('updateFollowingUsers', ids)
        } else {
          commit('updateFollowingUsers', [])
        }
        resolve()
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  },

  fetchFollowers({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = await db
          .collection('users')
          .doc(state.id)
          .collection('followers')
          .get()

        if (query.size > 0) {
          const ids = query.docs.map(
            (doc): FollowUser => {
              return doc.data() as FollowUser
            }
          )
          commit('updateFollowers', ids)
        } else {
          commit('updateFollowers', [])
        }
        resolve()
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  },

  followUser({ dispatch, state }, followingId) {
    return new Promise(async (resolve, reject) => {
      try {
        const batch = db.batch()

        const userRef = db
          .collection('users')
          .doc(state.id)
          .collection('followingUsers')
          .doc(followingId)
        batch.set(userRef, { id: followingId })

        const followingRef = db
          .collection('users')
          .doc(followingId)
          .collection('followers')
          .doc(state.id)
        batch.set(followingRef, { id: state.id })

        await batch.commit()
        dispatch('fetchFollowingUsers')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  unfollowUser({ dispatch, state }, followingId) {
    return new Promise(async (resolve, reject) => {
      try {
        const batch = db.batch()

        const userRef = await db
          .collection('users')
          .doc(state.id)
          .collection('followingUsers')
          .doc(followingId)

        batch.delete(userRef)

        const followingRef = await db
          .collection('users')
          .doc(followingId)
          .collection('followers')
          .doc(state.id)

        batch.delete(followingRef)

        await batch.commit()
        dispatch('fetchFollowingUsers')
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

  likePage({ state, dispatch }, pageId) {
    return new Promise(async (resolve, reject) => {
      try {
        const batch = db.batch()

        const userRef = db.collection('users').doc(state.id)
        batch.update(userRef, {
          likePages: firebase.firestore.FieldValue.arrayUnion(pageId)
        })

        const pageRef = db.collection('pages').doc(pageId)
        batch.update(pageRef, {
          likedBy: firebase.firestore.FieldValue.arrayUnion(state.id)
        })

        await batch.commit()
        dispatch('fetchUser')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  unlikePage({ state, dispatch }, pageId) {
    return new Promise(async (resolve, reject) => {
      try {
        const batch = db.batch()

        const userRef = db.collection('users').doc(state.id)
        batch.update(userRef, {
          likePages: firebase.firestore.FieldValue.arrayRemove(pageId)
        })

        const pageRef = db.collection('pages').doc(pageId)
        batch.update(pageRef, {
          likedBy: firebase.firestore.FieldValue.arrayRemove(state.id)
        })

        await batch.commit()
        dispatch('fetchUser')
        resolve()
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
          .doc(state.id)
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
          userId: state.id,
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

  deleteComment({ state }, { pageId, commentId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const batch = db.batch()

        const userRef = db
          .collection('users')
          .doc(state.id)
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
  updateUser(state, userData: UserData) {
    state.data = userData
  },

  updateImage(state, imageUrl: string) {
    state.data.image = imageUrl
  },

  updateId(state, id: string) {
    state.id = id
  },

  updatePages(state, pages: Page[]) {
    state.pages = pages
  },

  updateCommunities(state, communities) {
    state.communities = communities
  },

  updateTimeline(state, timeline: Page[]) {
    state.timeline = timeline
  },

  updateEmail(state, email) {
    state.email = email
  },

  updateFollowingUsers(state, followings: FollowUser[]) {
    state.followingUsers = followings
  },

  updateFollowers(state, followers: FollowUser[]) {
    state.followers = followers
  },

  // updateNotification (state, notifications) {
  //   state.notifications = notifications
  // },

  clearUserState(state) {
    state.data = blankUser.data
    state.pages = []
    state.communities = []
    state.timeline = []
    state.id = ''
  }
}

export const getters: GetterTree<UsersState, RootState> = {
  getUser: (state): User => {
    return {
      id: state.id,
      data: state.data,
      followers: state.followers,
      followingUsers: state.followingUsers
    }
  },

  getAccountId: state => {
    return state.data.accountId
  },

  getImage: state => {
    return state.data.image
      ? state.data.image
      : 'https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg'
  },

  getFollowingCount: state => {
    return state.followingUsers.length
  },

  getFollowerCount: state => {
    return state.followers.length
  },

  getLikeCount: state => {
    return state.data.likePages ? state.data.likePages.length : 0
  },

  isMyId: state => (id: string): boolean => {
    return state.id === id
  },

  isCommunityMember: state => communityId => {
    return Boolean(
      state.communities.filter(community => community.ID == communityId).length
    )
  },

  isCommunityOwner: state => communityOwnerAccountId => {
    return communityOwnerAccountId === state.data.accountId
  },

  isFollowingUser: state => userId => {
    return Boolean(
      state.followingUsers.find(following => {
        return following.id === userId
      })
    )
  },

  isFollowingCommunity: state => communityId => {
    // return Boolean(
    //   state.followings.filter(
    //     following =>
    //       following.FollowingId == communityId &&
    //       following.FollowingType === 'community'
    //   ).length
    // )
  },

  isMyAccountId: state => accountId => {
    return accountId === state.data.accountId
  },

  isLogin: state => {
    return !!state.id
  },

  isLikedPage: state => (pageId: string): boolean => {
    return state.data.likePages ? state.data.likePages.includes(pageId) : false
  },

  getTimeline: state => {
    return state.timeline
  },

  getNotifications: state => {
    return state.notifications
  }
}

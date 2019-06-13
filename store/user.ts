/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { db, auth, storage } from '~/plugins/firebase'
import firebase from 'firebase/app'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { User, UserData, blankUser } from '~/common/user'
import { Page, PageData } from '~/common/page'
const storageRef = storage.ref()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface UsersState {
  data: UserData
  pages: Page[]
  timeline: Page[]
  notifications: any
  id: string // Firebase UID
  email: string
}

export const state = () => ({
  data: blankUser.data,
  pages: [],
  timeline: [],
  notifications: [],
  id: '', // Firebase UID
  email: ''
})

export const actions: ActionTree<UsersState, RootState> = {
  initUser({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async authUser => {
        if (authUser) {
          commit('updateId', authUser.uid)
          commit('updateEmail', authUser.email)
          dispatch('fetchUser')
          dispatch('fetchPages')
          dispatch('fetchTimeline')

          resolve()
        } else {
          reject()
        }
      })
    })
  },

  async signup({ commit }, param) {
    try {
      const authData = await auth.createUserWithEmailAndPassword(
        param.email,
        param.password
      )
      await db
        .collection('users')
        .doc(authData.user!.uid)
        .set({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })

      commit('updateId', authData.user!.uid)
      return
    } catch (e) {
      return e
    }
  },

  async reauthenticate({ state }, param) {
    try {
      const user = auth.currentUser
      const credentials = firebase.auth.EmailAuthProvider.credential(
        state.email,
        param.password
      )

      await user!.reauthenticateAndRetrieveDataWithCredential(credentials)
      return
    } catch (e) {
      return e
    }
  },

  async deleteUser({ commit }) {
    try {
      const user = auth.currentUser
      await user!.delete()
      commit('clearUserState')
      return
    } catch (e) {
      console.log(e)
      return e
    }
  },

  // eslint-disable-next-line no-empty-pattern
  async updatePassword({}, param) {
    try {
      const user = auth.currentUser
      await user!.updatePassword(param.password)
      return
    } catch (e) {
      return e
    }
  },

  async logout({ commit }) {
    try {
      await firebase.auth().signOut()
      commit('clearUserState')
      return
    } catch (e) {
      return e
    }
  },

  async initialUpdate({ state, dispatch }, { accountId, name }) {
    try {
      await db
        .collection('users')
        .doc(state.id)
        .set({
          accountId: accountId,
          name: name,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      dispatch('fetchUser')
      return
    } catch (e) {
      return e
    }
  },

  async updateProfile(
    { dispatch, state },
    { name, description, birthday, homepage, twitter, facebook, instagram }
  ) {
    try {
      const param = {
        name: name,
        description: description,
        birthday: birthday,
        homepage: homepage,
        twitter: twitter,
        facebook: facebook,
        instagram: instagram,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }
      await db
        .collection('users')
        .doc(state.id)
        .update(param)

      dispatch('fetchUser')
      return
    } catch (e) {
      console.error('Error writing document: ', e)
      return e
    }
  },

  async updateImage({ state, commit }, imageBlob) {
    const imagePath = 'users/' + state.id + '/main-image'
    const imageRef = storageRef.child(imagePath)

    try {
      await imageRef.put(imageBlob)
      const url = await imageRef.getDownloadURL()

      await db
        .collection('users')
        .doc(state.id)
        .update({
          image: url,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      commit('updateImage', url)
      return
    } catch (e) {
      console.error('Error writing document: ', e)
      return e
    }
  },

  async createPage({ state, dispatch }, pageName = 'untitled') {
    try {
      const param = {
        name: pageName,
        userId: state.id,
        pageType: 'user',
        isDraft: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }
      const doc = await db.collection('pages').add(param)
      dispatch('fetchPages')
      return doc.id
    } catch (e) {
      console.error('Error writing document: ', e)
      return e
    }
  },

  async updatePage({ dispatch }, { id, isDraft, name, content, image }) {
    try {
      await db
        .collection('pages')
        .doc(id)
        .update({
          isDraft: isDraft,
          name: name,
          content: content,
          image: image,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      dispatch('fetchPages')
      return
    } catch (e) {
      console.error('Error writing document: ', e)
      return e
    }
  },

  async deletePage({ dispatch }, pageId) {
    try {
      await db
        .collection('pages')
        .doc(pageId)
        .delete()
      //console.log(ret)
      dispatch('fetchPages')
      return
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async fetchUser({ commit, state }) {
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
      return
    } catch (e) {
      return e
    }
  },

  async fetchPages({ commit, state }) {
    try {
      const query = await db
        .collection('pages')
        .where('pageType', '==', 'user')
        .where('userId', '==', state.id)
        .get()

      if (query.size > 0) {
        const pages = query.docs.map(
          (doc): Page => {
            return { id: doc.id, likedBy: [], data: doc.data() as PageData }
          }
        )
        commit('updatePages', pages)
      }

      return
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async fetchTimeline({ commit, state }) {
    try {
      const snapshot = await db
        .collection('users')
        .doc(state.id)
        .collection('timeline')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get()

      const timeline: Page[] = snapshot.docs.map(
        (doc): Page => {
          return { id: doc.id, likedBy: [], data: doc.data() as PageData }
        }
      )

      commit('updateTimeline', timeline)
      return
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async followUser({ commit, state }, followingId) {
    if (state.id === followingId) {
      return
    }
    try {
      await db
        .collection('users')
        .doc(state.id)
        .collection('follows')
        .doc()
        .set({
          from: state.id,
          to: followingId,
          type: 'user',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

      commit('addFollowing', followingId)
      //dispatch('fetchUser')
      return
    } catch (e) {
      return e
    }
  },

  async unfollowUser({ commit, state }, followingId) {
    try {
      const followingQuery = await db
        .collection('users')
        .doc(state.id)
        .collection('follows')
        .where('to', '==', followingId)
        .get()

      followingQuery.forEach(async doc => {
        await doc.ref.delete()
      })

      commit('deleteFollowing', followingId)
      //dispatch('fetchUser')
      return
    } catch (e) {
      return e
    }
  },

  async likePage({ state, dispatch }, pageId) {
    try {
      await db
        .collection('users')
        .doc(state.id)
        .collection('likes')
        .doc()
        .set({
          from: state.id,
          pageId: pageId,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

      dispatch('fetchUser')
      return
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async unlikePage({ state, dispatch }, pageId) {
    try {
      const pageQuery = await db
        .collection('users')
        .doc(state.id)
        .collection('likes')
        .where('pageId', '==', pageId)
        .get()

      pageQuery.forEach(async doc => {
        await doc.ref.delete()
      })

      dispatch('fetchUser')
      return
    } catch (e) {
      return e
    }
  },

  async createComment({ state }, { ownereId, pageId, text }) {
    try {
      await db
        .collection('pages')
        .doc(pageId)
        .collection('comments')
        .add({
          userId: state.id,
          text: text,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

      return
    } catch (e) {
      return e
    }
  },

  async deleteComment({ state }, { pageId, commentId }) {
    try {
      await db
        .collection('pages')
        .doc(pageId)
        .collection('comments')
        .doc(commentId)
        .delete()
      return
    } catch (e) {
      return e
    }
  }
}

export const mutations: MutationTree<UsersState> = {
  updateUser(state, userData: UserData) {
    const temp = Object.assign({}, blankUser.data)
    state.data = Object.assign(temp, userData)
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

  updateTimeline(state, timeline: Page[]) {
    state.timeline = timeline
  },

  updateEmail(state, email) {
    state.email = email
  },

  addFollowing(state, followingId) {
    state.data.followingUsers.push(followingId)
  },

  deleteFollowing(state, followingId) {
    state.data.followingUsers = state.data.followingUsers.filter(f => {
      return f !== followingId
    })
  },

  clearUserState(state) {
    state.data = blankUser.data
    state.pages = []
    state.timeline = []
    state.id = ''
  }
}

export const getters: GetterTree<UsersState, RootState> = {
  getUser: (state): User => {
    return {
      id: state.id,
      data: state.data
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
    return state.data.followingUsers.length
  },

  getFollowerCount: state => {
    return state.data.followers.length
  },

  getLikeCount: state => {
    return state.data.likes.length
  },

  isMyId: state => (id: string): boolean => {
    return state.id === id
  },

  isFollowingUser: state => userId => {
    return Boolean(
      state.data.followingUsers.find(followingId => {
        return followingId === userId
      })
    )
  },

  isMyAccountId: state => accountId => {
    return accountId === state.data.accountId
  },

  isLogin: state => {
    return !!state.id
  },

  isLikedPage: state => (pageId: string): boolean => {
    return state.data.likes ? state.data.likes.includes(pageId) : false
  },

  getTimeline: state => {
    return state.timeline
  },

  getNotifications: state => {
    return state.notifications
  }
}

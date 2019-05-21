/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { auth, storage } from '~/plugins/firebase'
import firebase from 'firebase'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { User, UserData, blankUser } from '~/common/user'
import { Page, PageData } from '~/common/page'
const db = firebase.firestore()
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

export const state: UsersState = {
  data: blankUser.data,
  pages: [],
  timeline: [],
  notifications: [],
  id: '', // Firebase UID
  email: ''
}

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
          .set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          })

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
        console.log(e)
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
          .set({
            accountId: accountId,
            name: name,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          })
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
          instagram: instagram,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
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
          isDraft: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
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

  updatePage({ dispatch }, { id, isDraft, name, content, image }) {
    return new Promise(async (resolve, reject) => {
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
        //console.log(ret)
        dispatch('fetchPages')
        resolve()
      } catch (e) {
        console.log(e)
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
          .where('ownerType', '==', 'user')
          .where('ownerId', '==', state.id)
          .get()

        if (query.size > 0) {
          const pages = query.docs.map(
            (doc): Page => {
              return { id: doc.id, likedBy: [], data: doc.data() as PageData }
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

  async fetchTimeline({ commit, state }) {
    return new Promise(async (resolve, reject) => {
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
        resolve()
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  },

  followUser({ commit, state }, followingId) {
    if (state.id === followingId) {
      return
    }
    return new Promise(async (resolve, reject) => {
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
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  unfollowUser({ commit, state }, followingId) {
    return new Promise(async (resolve, reject) => {
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
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  likePage({ state, dispatch }, pageId) {
    return new Promise(async (resolve, reject) => {
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
        resolve()
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  },

  unlikePage({ state, dispatch }, pageId) {
    return new Promise(async (resolve, reject) => {
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
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  createComment({ state }, { ownereId, pageId, text }) {
    return new Promise(async (resolve, reject) => {
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

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  deleteComment({ state }, { pageId, commentId }) {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .collection('pages')
          .doc(pageId)
          .collection('comments')
          .doc(commentId)
          .delete()
        resolve()
      } catch (e) {
        reject(e)
      }
    })
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

import config from '@/firebase-setup/config'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app()

export default firebaseApp
export const db = firebaseApp.firestore()
export const auth = firebaseApp.auth()
export const storage = firebaseApp.storage()

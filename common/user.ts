import firebase from 'firebase'
import { TimeStamp } from 'firebase/firebase-firestore'
const db = firebase.firestore()

export interface User {
  uid: string
  data: UserData
}

export interface UserData {
  accountId: string
  name: string
  image: string
  createdAt: TimeStamp
}

export const blankUser = {
  uid: '',
  data: {
    accountId: '',
    name: 'unknown',
    image: '',
    createdAt: null
  }
}

export async function getUser(uid: string): Promise<User> {
  try {
    const doc = await db
      .collection('users')
      .doc(uid)
      .get()

    if (doc.exists) {
      const user: User = { uid: uid, data: doc.data() as UserData }
      return user
    }
    return blankUser
  } catch (e) {
    console.log(e)
    return blankUser
  }
}

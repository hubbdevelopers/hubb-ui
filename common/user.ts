import firebase from 'firebase'
import { TimeStamp } from 'firebase/firebase-firestore'
const db = firebase.firestore()

export interface User {
  id: string
  data: UserData
}

export interface UserData {
  accountId: string
  name: string
  image: string
  likePages: string[]
  createdAt: TimeStamp
}

export const blankUser = {
  id: '',
  data: {
    accountId: '',
    name: 'unknown',
    image: '',
    likePages: [],
    createdAt: null
  }
}

export async function getUser(id: string): Promise<User> {
  try {
    const doc = await db
      .collection('users')
      .doc(id)
      .get()

    if (doc.exists) {
      const user: User = { id: id, data: doc.data() as UserData }
      return user
    }
    return blankUser
  } catch (e) {
    console.log(e)
    return blankUser
  }
}

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
  followingUsers: string[]
  followers: string[]
  createdAt: TimeStamp
}

export const blankUser = {
  id: '',
  data: {
    accountId: '',
    name: '',
    image: '',
    likePages: [],
    followingUsers: [],
    followers: [],
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

export async function getUsers(): Promise<User[]> {
  try {
    const collection = await db.collection('users').get()

    const users: User[] = []

    collection.forEach(
      (doc): void => {
        if (doc.exists) {
          users.push({ id: doc.id, data: doc.data() as UserData })
        }
      }
    )
    return users
  } catch (e) {
    console.log(e)
    return []
  }
}

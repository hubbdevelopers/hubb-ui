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
  followingUsers: string[]
  followers: string[]
  likeCount: number
  createdAt: TimeStamp
}

export interface FollowUser {
  id: string
}

export const blankUser = {
  id: '',
  data: {
    accountId: '',
    name: '',
    image: '',
    followingUsers: [],
    followers: [],
    likeCount: 0,
    createdAt: null
  }
}

export function getBlankUser(): User {
  return blankUser
}

export async function getUser(id: string): Promise<User> {
  try {
    const doc = await db
      .collection('users')
      .doc(id)
      .get()

    if (doc.exists) {
      const temp = Object.assign({}, blankUser.data)
      const user: User = {
        id: id,
        data: Object.assign(temp, doc.data())
      }
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
        const temp = Object.assign({}, blankUser.data)
        if (doc.exists) {
          users.push({
            id: doc.id,
            data: Object.assign(temp, doc.data())
          })
        }
      }
    )
    return users
  } catch (e) {
    console.log(e)
    return []
  }
}
